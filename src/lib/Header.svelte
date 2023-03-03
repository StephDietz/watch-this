<script>
	import TvIcon from './TvIcon.svelte';
</script>

<div
	class="max-w-4xl mx-auto w-full flex md:flex-row flex-col items-center md:justify-between py-8 mb-12 border-b border-white/20"
>
	<button on:click class="flex items-center mb-4 md:mb-0 text-white/70">
		<TvIcon />
		<div class="text-2xl md:text-xl font-bold ml-2">watchthis.dev</div>
	</button>
	<a
		class="bg-white/20 hover:bg-white/50 shadow text-white hover:text-pink-600 font-medium rounded p-2 text-sm flex items-center"
		href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStephDietz%2Fwatch-this&env=VITE_OPENAI_API_KEY&envDescription=Open%20AI%20API%20key&demo-title=watchthis.dev&demo-url=https%3A%2F%2Fwatchthis.dev"
	>
		<span class="button_prefix__e8xDo"
			><svg height="16" viewBox="0 0 113 100" width="16" xmlns="http://www.w3.org/2000/svg"
				><defs
					><linearGradient id="a" x1="196.57%" x2="50%" y1="228.82%" y2="50%"
						><stop offset="0%" /><stop offset="100%" stop-color="currentColor" /></linearGradient
					></defs
				><path
					d="M350.5 150L407 250H294z"
					fill="url(#a)"
					fill-rule="evenodd"
					transform="translate(-294 -150)"
				/></svg
			></span
		>
		<span class="ml-2">Deploy</span>
	</a>
</div>
