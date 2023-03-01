<script>
	/**
	 * @type {{title: string, description: string}}
	 */
	export let recommendation;

	async function getRecommendationInfo() {
		const response = await fetch('/api/getMediaDetails', {
			method: 'POST',
			body: JSON.stringify({ title: recommendation.title }),
			headers: {
				'content-type': 'application/json'
			}
		});
		let recommendationDetails = await response.json();
		return recommendationDetails;
	}

	let promise = getRecommendationInfo();
</script>

<div>
	{recommendation.title}
	{#await promise}
		<p>loading..</p>
	{:then data}
		<div>
			<p>The data is {data.Actors}</p>
			<img src={data.Poster} />
		</div>
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
