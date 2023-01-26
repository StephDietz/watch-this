export async function api(searched) {
	const endpoint = 'https://api.openai.com/v1/completions';
	const key = import.meta.env.VITE_OPENAI_API_KEY;

	const payload = {
		model: 'text-davinci-003',
		prompt: searched,
		temperature: 0.7,
		max_tokens: 2048,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0
	};
	try {
		const result = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${key}`
			},
			body: JSON.stringify(payload)
		});

		return {
			status: result.status,
			body: await result.json()
		};
	} catch (error) {
		console.error('Error:', error);
		return {
			status: 500,
			error: 'Error receiving data'
		};
	}
}
