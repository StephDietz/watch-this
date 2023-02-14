<script>
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import LoadingIndicator from '../lib/Loading.svelte';
	const categoryTypes = [
		'Action',
		'Adventure',
		'Animation',
		'Biography',
		'Comedy',
		'Crime',
		'Documentary',
		'Drama',
		'Family',
		'Fantasy',
		'Film-Noir',
		'History',
		'Horror',
		'Musical',
		'Mystery',
		'Romance',
		'Sci-Fi',
		'Sport',
		'Thriller',
		'War',
		'Western',
		'Art-house',
		'Black-Comedy',
		'Chick-flick',
		'Cult-classic',
		'Dark-Comedy',
		'Epic',
		'Erotic',
		'Experimental',
		'Fairy-tale',
		'Film-within-a-film',
		'Futuristic',
		'Gangster',
		'Heist',
		'Historical',
		'Holiday',
		'Indie',
		'Juvenile',
		'Melodrama',
		'Monster',
		'Political',
		'Psychological',
		'Road-movie',
		'Satire',
		'Science-Fiction',
		'Slapstick',
		'Social-issue',
		'Superhero',
		'Surreal',
		'Teen',
		'Vampire',
		'Zombie'
	];
	let loading = false;
	let error = '';

	/**
	 * @type {string}
	 */
	let searchResponse = '';

	// $: recStream = streamChunks.join('');
	$: {
		let x = searchResponse?.split('\n');

		// Filter out ""

		// searchResponse?.split('\n').map((str) => {
		// 	const [, title, description] = str.match(/\d\.\s*(.*?):\s*(.*)/);

		// 	return { title, description };
		// });
	}

	let recommendations = [];
	/**
	 * @type {string}
	 */
	let cinemaType = 'tv show';
	/**
	 * @type {Array<string>}
	 */
	let selectedCategories = [];
	let specificDescriptors = '';
	/**
	 * @type {Array<{title: string, description: string}>}
	 */
	// let recommendations = [];
	/**
	 * @param {string} str
	 */
	function reformData(str) {
		if (str.trim() === '') {
			return;
		}
		// @ts-ignore
		const [, title, description] = str.match(/\d\.\s*(.*?):\s*(.*)/);
		return { title, description };
	}

	async function search() {
		if (loading) return;

		recommendations = [];
		loading = true;
		let fullSearchCriteria = `Give me a list of 5 ${cinemaType} recommendations ${
			selectedCategories ? `that fit all of the following categories: ${selectedCategories}` : ''
		}. ${
			specificDescriptors
				? `Make sure it fits the following description as well: ${specificDescriptors}.`
				: ''
		} ${
			selectedCategories || specificDescriptors
				? `If you do not have 5 recommendations that fit these criteria perfectly, do your best to suggest other ${cinemaType}'s that I might like.`
				: ''
		} Please return this response as a numbered list with the ${cinemaType}'s title, followed by a colon, and then a brief description of the ${cinemaType}. There should be a line of whitespace between each item in the list.`;
		const response = await fetch('/api/getRecommendation', {
			method: 'POST',
			body: JSON.stringify({ searched: fullSearchCriteria }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (response.ok) {
			try {
				const data = response.body;
				if (!data) {
					return;
				}

				const reader = data.getReader();
				const decoder = new TextDecoder();

				while (true) {
					const { value, done } = await reader.read();
					const chunkValue = decoder.decode(value);

					// streamChunks.push(chunkValue);
					// streamChunks = [...streamChunks, chunkValue];
					searchResponse += chunkValue;

					// console.log({ streamChunks: searchResponse });

					// if (chunkValue.trim() === '') {
					// 	let obj = reformData(recStream);
					// 	if (obj) {
					// 		recommendations.push(obj);
					// 		recommendations = recommendations;
					// 	}
					// 	recStream = '';
					// 	streamChunks = [];
					// } else {
					// 	streamChunks.push(chunkValue);
					// 	streamChunks = streamChunks;
					// 	recStream = streamChunks.reduce((acc, val) => acc + val, '');
					// }

					if (done) {
						break;
					}
				}
			} catch (err) {
				error = 'Looks like OpenAI timed out :(';
			}
		} else {
			error = await response.text();
		}
		loading = false;
	}
</script>

<div>
	<Header />
	<div class="text-center font-extrabold text-black text-3xl md:text-5xl mb-10">
		Get curated show or movie recommendations with Open AI
	</div>
	<div class="mb-8">
		<div class="mb-4 font-semibold">What kind of cinema are you searching for?</div>
		<div>
			<select class="p-2 rounded-md border text-gray-600 w-full text-sm" bind:value={cinemaType}>
				<option value="tv show"> TV Show </option>
				<option value="movie"> Movie </option>
				<option value="tv show or movie"> No Preference </option>
			</select>
		</div>
	</div>
	<div>
		<div class="mb-4 font-semibold">
			Select all categories that you want the show or movie to include.
		</div>
		<div class="flex items-center flex-wrap">
			{#each categoryTypes as category}
				<label class="mr-2 mb-2">
					<input
						type="checkbox"
						bind:group={selectedCategories}
						name="categories"
						value={category}
					/>
					{category}
				</label>
			{/each}
		</div>
	</div>
	<div class="my-8">
		<div class="mb-4 font-semibold">
			Write any other specifications here. Be as picky as you'd like.
		</div>
		<textarea
			bind:value={specificDescriptors}
			class="p-2 rounded-md border text-gray-600 w-full h-20 text-sm"
			placeholder="Ex. Must have at least 2 seasons and be on Netflix or Hulu."
		/>
		<button
			on:click={search}
			class={`${
				loading
					? 'bg-indigo-300'
					: 'bg-indigo-500 hover:bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 '
			} mt-4 w-full h-10 text-white font-bold p-3 rounded flex items-center justify-center`}
		>
			{#if loading}
				<LoadingIndicator />
			{:else}
				<p>Curate My List</p>
			{/if}
		</button>
	</div>

	{#if loading && !searchResponse && !recommendations}
		<div class="fontsemibold text-lg text-center mt-8 mb-4">
			Please be patient as I think. Good things are coming 😎.
		</div>
	{/if}
	{#if error}
		<div class="fontsemibold text-lg text-center mt-8 text-red-500">
			Woops! {error}
		</div>
	{/if}
	{#if recommendations}
		{#each recommendations as recommendation, i (i)}
			<div class="mb-4 rounded-lg shadow bg-white p-4">
				<div class="text-2xl font-bold mb-2">
					{recommendation.title}
				</div>
				<div class="">
					{recommendation.description}
				</div>
			</div>
		{/each}
	{/if}
	<div>
		{searchResponse}
	</div>
	<Footer />
</div>
