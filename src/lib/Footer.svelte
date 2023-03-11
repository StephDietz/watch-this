<script>
	import GitHubButton from './GitHubButton.svelte';
</script>

<div
	class="max-w-4xl mx-auto w-full flex md:flex-row flex-col items-center md:justify-between py-8 mt-20 border-t border-white/20"
>
	<div class="text-white/70 flex items-center flex-none">
		Powered by <span class="mx-1 font-bold"> OpenAI</span>
		and
		<span class="ml-1 font-bold">Vercel Edge Functions</span>.
	</div>
	<div class="flex items-center mt-2 md:mt-0">
		<a class="group" aria-label="TaxPal on Twitter" href="https://twitter.com/steph_dietz_"
			><svg aria-hidden="true" class="mr-4 h-6 w-6 fill-white/50 group-hover:fill-white/70"
				><path
					d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84"
				/></svg
			></a
		>
		<GitHubButton />
	</div>
</div>
