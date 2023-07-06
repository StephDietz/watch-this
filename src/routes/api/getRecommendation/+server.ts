import { createParser } from 'eventsource-parser';
import { OPENAI_API_KEY } from '$env/static/private';

const key = OPENAI_API_KEY;

// Object to store the number of requests made by each user and their last request timestamp
interface UserRequestData {
	count: number;
	lastRequestTime: number;
}

// Object to store the number of requests made by each user
const requestCounts: Record<string, UserRequestData> = {};

// Middleware function to enforce rate limits
function rateLimitMiddleware(request: Request) {
	const userIP = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
	const userRequests = requestCounts[userIP];

	// Check if the user has made requests before
	if (userRequests) {
		const { count, lastRequestTime } = userRequests;
		const currentTime = Date.now();

		// Check if 24 hours have elapsed since the last request
		if (currentTime - lastRequestTime >= 24 * 60 * 60 * 1000) {
			// Reset the request count and update the last request timestamp
			userRequests.count = 1;
			userRequests.lastRequestTime = currentTime;
		} else {
			// Check if the user has exceeded the rate limit (5 requests per day)
			if (count >= 5) {
				return new Response('Rate limit exceeded, come back tomorrow!', { status: 429 });
			}

			// Increment the request count for the user
			userRequests.count++;
		}
	} else {
		// Create a new user entry with initial request count and timestamp
		requestCounts[userIP] = {
			count: 1,
			lastRequestTime: Date.now()
		};
	}

	return null;
}

interface OpenAIStreamPayload {
	model: string;
	prompt: string;
	temperature: number;
	top_p: number;
	frequency_penalty: number;
	presence_penalty: number;
	max_tokens: number;
	stream: boolean;
	n: number;
}

async function OpenAIStream(payload: OpenAIStreamPayload) {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();

	let counter = 0;

	const res = await fetch('https://api.openai.com/v1/completions', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		},
		method: 'POST',
		body: JSON.stringify(payload)
	});

	const stream = new ReadableStream({
		async start(controller) {
			function onParse(event: any) {
				if (event.type === 'event') {
					const data = event.data;
					// https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
					if (data === '[DONE]') {
						controller.close();
						return;
					}
					try {
						const json = JSON.parse(data);
						const text = json.choices[0].text;

						if (counter < 2 && (text.match(/\n/) || []).length) {
							// this is a prefix character (i.e., "\n\n"), do nothing
							return;
						}
						const queue = encoder.encode(text);
						controller.enqueue(queue);
						counter++;
					} catch (e) {
						controller.error(e);
					}
				}
			}

			// stream response (SSE) from OpenAI may be fragmented into multiple chunks
			// this ensures we properly read chunks and invoke an event for each SSE event stream
			const parser = createParser(onParse);
			// https://web.dev/streams/#asynchronous-iteration
			for await (const chunk of res.body as any) {
				parser.feed(decoder.decode(chunk));
			}
		}
	});
	return stream;
}

export async function POST({ request }: { request: any }) {
	// Apply rate limit middleware
	const rateLimitResult = rateLimitMiddleware(request);
	if (rateLimitResult) {
		return rateLimitResult;
	}
	const { searched } = await request.json();
	const payload = {
		model: 'text-davinci-003',
		prompt: searched,
		temperature: 0.7,
		max_tokens: 2048,
		top_p: 1.0,
		frequency_penalty: 0.0,
		stream: true,
		presence_penalty: 0.0,
		n: 1
	};
	const stream = await OpenAIStream(payload);
	return new Response(stream);
}
