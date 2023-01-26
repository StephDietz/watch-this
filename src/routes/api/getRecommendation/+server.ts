import { api } from '../api';
import { error } from '@sveltejs/kit';

export async function POST({ request }) {
	const { searched } = await request.json();
	console.log(searched);
	const res = await api(searched);
	if (res.status === 200) {
		const response = res.body;
		console.log(response);
		if (response) {
			return new Response(JSON.stringify(response));
		}
		throw error(404);
	} else {
		throw error(res.status);
	}
}
