<script>
	import LoadingIndicator from './Loading.svelte';

	/**
	 * @type string
	 */
	export let cinemaType;
	/**
	 * @type Array<string>
	 */
	export let selectedCategories;
	/**
	 * @type string
	 */
	export let specificDescriptors;
	/**
	 * @type Boolean
	 */
	export let loading;

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

	let cinemaTypes = [
		{ value: 'tv show', title: 'TV Show' },
		{ value: 'movie', title: 'Movie' },
		{ value: 'tv show or movie', title: 'No Preference' }
	];
</script>

<div class="pt-6 md:pt-10 text-slate-200">
	<div>
		<div class="mb-8">
			<div class="mb-4 font-semibold text-lg">What kind of cinema are you searching for?</div>
			<div class="flex items-center">
				{#each cinemaTypes as type (type.value)}
					<button
						on:click={() => {
							cinemaType = type.value;
						}}
						class={`${
							cinemaType === type.value ? 'bg-pink-600/40' : ''
						} text-slate-200 font-bold mr-2 text-sm mt-2 py-2 px-4 rounded-full border border-pink-600`}
					>
						{type.title}
					</button>
				{/each}
			</div>
		</div>
		<div>
			<div class="mb-4 font-semibold text-lg">
				Select all categories that you want the show or movie to include.
			</div>
			<div class="flex items-center flex-wrap">
				{#each categoryTypes as category}
					<label
						class={`${
							selectedCategories.includes(category) ? 'bg-pink-600/40' : ''
						} text-slate-200 font-bold mr-2 mt-2 text-sm py-2 px-4 rounded-full border border-pink-600`}
					>
						<input
							class="hidden"
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
		<div class="mt-8">
			<div class="mb-4 font-semibold text-lg">
				Write any other specifications here. Be as picky as you'd like.
			</div>
			<textarea
				bind:value={specificDescriptors}
				class="bg-white/40 border border-white/0 p-2 rounded-md placeholder:text-slate-800 text-slate-900 w-full h-20 font-medium"
				placeholder="Ex. Must have at least 2 seasons and be on Netflix or Hulu."
			/>
			<button
				on:click
				class={`${
					loading
						? 'bg-pink-400/50'
						: 'bg-pink-600 hover:bg-gradient-to-r from-pink-700 via-pink-600 to-pink-700 '
				} mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center`}
			>
				{#if loading}
					<LoadingIndicator />
				{:else}
					<p>Curate My List</p>
				{/if}
			</button>
		</div>
	</div>
</div>
