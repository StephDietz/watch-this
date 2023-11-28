<script>
	import * as animateScroll from 'svelte-scrollto';
	import { fade } from 'svelte/transition';
	import Form from '$lib/Form.svelte';
	import Home from '$lib/Home.svelte';
	import Footer from '$lib/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import RecommendationCard from '$lib/RecommendationCard.svelte';
	import { onMount } from 'svelte';
	import LoadingCard from '$lib/LoadingCard.svelte';
	import { dataset_dev } from 'svelte/internal';
	let loading = false;
	let error = '';
	let endStream = false;
	let makeRecommendation = false;
	let anwswerList = [];

	/**
	 * @type {string}
	 */
	let searchResponse = '';
	/**
	 * @type {Array<string | {title: string, description: string}>}
	 */
	let recommendations = [];

	/**
	 * @param {string} target
	 */

	$: {
		if (searchResponse) {
			searchResponse = searchResponse?.replaceAll('\\n', '\n');
			// let lastLength = recommendations.length;
			// let x = searchResponse?.split('\n');
			// recommendations = x.map((d, i) => {
			// 	if ((x.length - 1 > i || endStream) && d !== '') {
			// 		// @ts-ignore
			// 		const [, title, description] = d.match(/\d\.\s*(.*?):\s*(.*)/);
			// 		return { title, description };
			// 	} else {
			// 		return d;
			// 	}
			// });
			// if (recommendations.length > lastLength) {
			// 	animateScroll.scrollToBottom({ duration: 1500 });
			// }
		}
		// console.log(searchResponse);
	}

	/**
	 * @type {string}
	 */
	let cinemaType = 'tv show';
	/**
	 * @type {Array<string>}
	 */
	let selectedCategories = [];
	let specificDescriptors = '';

	async function search() {
		if (loading) return;
		recommendations = [];
		searchResponse = '';
		endStream = false;
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

		fullSearchCriteria = `Being the adjust product support, support our customers in anything they ask. Here is what they are asking: ${
			specificDescriptors
				? `Make sure it fits the following description as well: ${specificDescriptors}.`
				: ''
		}. Please return the response in a step by step number list. There should be a line of whitespace between each item in the list.`;

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

					searchResponse += chunkValue;

					if (done) {
						endStream = true;
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
	function clearForm() {
		recommendations = [];
		searchResponse = '';
		endStream = false;
		cinemaType = 'tv show';
		selectedCategories = [];
		specificDescriptors = '';
	}
</script>

<div>
	<div class="h-screen w-full bg-cover fixed" style="background-image: url(/background-adjust.png)">
		<div
			class={`backdrop-blur-sm flex flex-col items-center justify-center min-h-screen w-full h-full bg-gradient-to-br from-slate-900/80 to-black/90`}
		/>
	</div>

	<div class="absolute inset-0 px-6 flex flex-col h-screen overflor-auto">
		<Header />
		<div in:fade class="w-full max-w-4xl mx-auto">
			<div class="w-full mb-8">
				<Form
					bind:cinemaType
					bind:selectedCategories
					bind:loading
					bind:specificDescriptors
					on:click={search}
				/>
				{#if recommendations.length > 0 && endStream}
					<button
						on:click={clearForm}
						class="bg-white/20 hover:bg-white/30 mt-4 w-full h-10 text-white font-bold p-3 rounded-full flex items-center justify-center"
					>
						Clear Search
					</button>
				{/if}
			</div>
			<div class="md:pb-20 max-w-4xl mx-auto w-full">
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
				{#if searchResponse}
					<div in:fade>
						<LoadingCard incomingStream={searchResponse} />
					</div>
				{/if}
				<!-- {#if searchResponse}
					{#each searchResponse?.split('\\n\\n') as answer, i (i)}
						<div>
							<div class="mb-8">
								<div in:fade>
									<LoadingCard incomingStream={answer} />
								</div>
							</div>
						</div>
					{/each}
				{/if} -->
			</div>
		</div>
		<Footer />
	</div>
</div>
