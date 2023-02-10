<script>
	import GitHubButton from './GitHubButton.svelte';
	import TvIcon from './TvIcon.svelte';
</script>

<div class="flex md:flex-row flex-col items-center md:justify-between py-8 mb-12 border-b">
	<div class="flex items-center my-1">
		<TvIcon />
		<div class="text-2xl md:text-xl font-bold ml-2">watchthis.dev</div>
	</div>
	<GitHubButton />
</div>
