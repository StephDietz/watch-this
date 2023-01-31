import { error } from '@sveltejs/kit';

const endpoint = 'https://api.openai.com/v1/completions';
const key = import.meta.env.VITE_OPENAI_API_KEY;

export async function POST({ request }) {
	const { searched } = await request.json();
	// const res = await api(searched);
	// let res;
	const payload = {
		model: 'text-davinci-003',
		prompt: searched,
		temperature: 0.7,
		max_tokens: 2048,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0
	};

	// throw new Error('unexpected');

	// try {
	return await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify(payload)
	});

	// res = {
	// 	status: result.status,
	// 	body: await result.json()
	// };
	// } catch (error) {
	// 	res = {
	// 		status: 500,
	// 		error: 'Error receiving data'
	// 	};
	// }

	// if (res.status === 200) {
	// 	const response = res.body;
	// 	console.log(response);
	// 	if (response) {
	// 		return new Response(JSON.stringify(response));
	// 	}
	// 	throw error(404);
	// } else {
	// 	throw error(res.status);
	// }
}

// async function api(searched) {

// }
