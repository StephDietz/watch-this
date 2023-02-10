<script>
	import GitHubButton from '$lib/GitHubButton.svelte';
	import TvIcon from '$lib/TvIcon.svelte';
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
	 * @type {Array<string>}
	 */
	let streamChunks = [];
	let recStream = '';
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
	let recommendations = [];
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
		let fullSearchCriteria = `Give me a list of 5 ${cinemaType} recommendations that fit all of the following categories: ${selectedCategories}. ${
			specificDescriptors
				? `Make sure it fits the following description as well: ${specificDescriptors}.`
				: ''
		} Please include descriptions of each show as well. `;
		const response = await fetch('/api/getRecommendation', {
			method: 'POST',
			body: JSON.stringify({ searched: fullSearchCriteria }),
			headers: {
				'content-type': 'application/json'
			}
		});
		if (response.ok) {
			const data = response.body;
			if (!data) {
				return;
			}

			const reader = data.getReader();
			const decoder = new TextDecoder();
			let done = false;

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value);

				if (chunkValue.trim() === '') {
					let obj = reformData(recStream);
					if (obj) {
						recommendations.push(obj);
						recommendations = recommendations;
					}
					recStream = '';
					streamChunks = [];
				} else {
					streamChunks.push(chunkValue);
					streamChunks = streamChunks;
					recStream = streamChunks.reduce((acc, val) => acc + val, '');
				}
			}
		} else {
			/*
            Possible errors:
            
            Chat GPT times out. In this case error is a JSON object
            that looks like this: {"message":"Error: 500"}

            Vercel serverless function times out. In this the error
            is text that looks like: "An error occurred with your deployment FUNCTION_INVOCATION_TIMEOUT"
            */
			console.log(response);
			error = await response.text();
			console.log(error);
		}

		loading = false;
	}
</script>

<div>
	<div class="flex items-center justify-between py-8 mb-12 border-b">
		<div class="flex items-center">
			<TvIcon />
			<div class="text-xl font-bold ml-2">watchthis.dev</div>
		</div>
		<GitHubButton />
	</div>
	<div class="text-center font-extrabold text-indigo-700 text-2xl md:text-4xl mb-10">
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

	{#if loading && !recStream && !recommendations}
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
		{recStream}
	</div>
	<div class="flex items-center justify-between py-8 mt-20 border-t">
		<div class="flex items-center">
			Powered by <a
				href="https://openai.com/"
				target="_blank"
				class="mx-1 font-bold hover:underline">OpenAI</a
			>
			and
			<a href="https://vercel.com" target="_blank" class="ml-1 font-bold hover:underline">Vercel</a
			>.
		</div>
		<div class="flex space-x-4 pb-4 sm:pb-0">
			<a class="group" aria-label="TaxPal on Twitter" href="https://twitter.com/steph_dietz_"
				><svg aria-hidden="true" class="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
					><path
						d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84"
					/></svg
				></a
			><a
				class="group"
				aria-label="TaxPal on GitHub"
				href="https://github.com/StephDietz/watch-this"
				><svg aria-hidden="true" class="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
					><path
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
					/></svg
				></a
			>
		</div>
	</div>
</div>
