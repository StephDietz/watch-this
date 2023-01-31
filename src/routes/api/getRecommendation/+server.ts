import { error } from '@sveltejs/kit';

const endpoint = 'https://api.openai.com/v1/completions';
const key = import.meta.env.VITE_OPENAI_API_KEY;

export async function POST({ request }) {
	const { searched } = await request.json();
	const payload = {
		model: 'text-davinci-003',
		prompt: searched,
		temperature: 0.7,
		max_tokens: 2048,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0
	};

	return await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify(payload)
	});
}
