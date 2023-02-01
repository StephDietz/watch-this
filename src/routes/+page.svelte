<script>
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
		let lines = str.split('\n\n');
		lines.shift();
		lines = lines;
		console.log(lines);
		return lines.map((line) => {
			// @ts-ignore
			const [, title, description] = line.match(/\d\.\s*(.*?):\s*(.*)/);
			return { title, description };
		});
	}

	async function search() {
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
			let res = await response.json();
			recommendations = reformData(res.choices[0].text);
		} else {
			/*
            Possible errors:
            
            Chat GPT times out. In this case error is a JSON object
            that looks like this: {"message":"Error: 500"}

            Vercel serverless function times out. In this the error
            is text that looks like: "An error occurred with your deployment FUNCTION_INVOCATION_TIMEOUT"
            */
			error = await response.text();
		}

		loading = false;
	}
</script>

<div>
	<div class="text-center font-bold text-2xl md:text-4xl mb-10">
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
			class="mt-4 w-full h-10 text-white font-bold p-3 rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
		>
			{#if loading}
				<LoadingIndicator />
			{:else}
				<p>Curate My List</p>
			{/if}
		</button>
	</div>
	{#if loading}
		<div class="fontsemibold text-lg text-center mt-8">
			Please be patient as I think. Good things are coming 😎.
		</div>
	{/if}
	{#if error}
		<div class="fontsemibold text-lg text-center mt-8">
			Woops! {error}
		</div>
	{/if}
	{#if recommendations}
		{#each recommendations as recommendation}
			<div class="mb-4">
				<div class="text-2xl font-bold mb-2">
					{recommendation.title}
				</div>
				<div class="">
					{recommendation.description}
				</div>
			</div>
		{/each}
	{/if}
</div>
