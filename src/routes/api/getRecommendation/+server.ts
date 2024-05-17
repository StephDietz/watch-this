import { createParser } from 'eventsource-parser';
import { OPENAI_API_KEY, KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { createClient } from '@vercel/kv';

const key = OPENAI_API_KEY;

// Object to store the number of requests made by each user and their last request timestamp
interface UserRequestData {
	count: number;
	lastResetTime: number;
}

const kv = createClient({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

async function getUserRequestData(userIP: string): Promise<UserRequestData | null> {
	try {
		const data = await kv.get<UserRequestData>(userIP);
		return data;
	} catch (error) {
		console.error('Error retrieving user request data:', error);
		throw error;
	}
}

async function updateUserRequestData(userIP: string, data: UserRequestData) {
	try {
		await kv.set(userIP, data);
	} catch (error) {
		console.error('Error updating user request data:', error);
		throw error;
	}
}

// Middleware function to enforce rate limits
async function rateLimitMiddleware(request: Request) {
	// const userIP = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
	const userIP =
		request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '';

	const userRequests = await getUserRequestData(userIP);

	// Check if the user has made requests before
	if (userRequests) {
		const { count, lastResetTime } = userRequests;
		const currentTime = Date.now();

		// Check if it's a new day and reset the count
		const currentDay = new Date(currentTime).toLocaleDateString();
		const lastResetDay = new Date(lastResetTime).toLocaleDateString();
		if (currentDay !== lastResetDay) {
			userRequests.count = 1;
			userRequests.lastResetTime = currentTime;
			await updateUserRequestData(userIP, userRequests);
		} else {
			// Check if the user has exceeded the rate limit (5 requests per day)
			if (count >= 5) {
				return new Response('Rate limit exceeded, come back tomorrow!', { status: 429 });
			}

			// Increment the request count for the user
			userRequests.count++;
			await updateUserRequestData(userIP, userRequests);
		}
	} else {
		// Create a new user entry with initial request count and timestamp
		const newUserRequests: UserRequestData = {
			count: 1,
			lastResetTime: Date.now()
		};
		await updateUserRequestData(userIP, newUserRequests);
	}

	return null;
}

interface ChatGPTMessage {
	role: 'user';
	content: string;
}

interface OpenAIStreamPayload {
	model: string;
	messages: ChatGPTMessage[];
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

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		},
		method: 'POST',
		body: JSON.stringify(payload)
	});

	const readableStream = new ReadableStream({
		async start(controller) {
			const onParse = (event: any) => {
				if (event.type === 'event') {
					const data = event.data;
					controller.enqueue(encoder.encode(data));
				}
			};
			if (res.status !== 200) {
				const data = {
					status: res.status,
					statusText: res.statusText,
					body: await res.text()
				};
				console.log(`Error: recieved non-200 status code, ${JSON.stringify(data)}`);
				controller.close();
				return;
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
	let counter = 0;
	const transformStream = new TransformStream({
		async transform(chunk, controller) {
			const data = decoder.decode(chunk);
			// https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
			if (data === '[DONE]') {
				controller.terminate();
				return;
			}
			try {
				const json = JSON.parse(data);
				const text = json.choices[0].delta?.content || '';
				if (counter < 2 && (text.match(/\n/) || []).length) {
					// this is a prefix character (i.e., "\n\n"), do nothing
					return;
				}
				const encodedText = encoder.encode(text);
				controller.enqueue(encodedText);
				counter++;
			} catch (e) {
				controller.error(e);
			}
		}
	});
	return readableStream.pipeThrough(transformStream);
}

export async function POST({ request }: { request: any }) {
	// Apply rate limit middleware
	const rateLimitResult = await rateLimitMiddleware(request);
	if (rateLimitResult) {
		return rateLimitResult;
	}
	const { searched } = await request.json();
	const payload = {
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'user', content: searched }],
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
