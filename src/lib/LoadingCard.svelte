<script>
	/**
	 * @type {any}
	 */
	export let incomingStream;
</script>

<div class="relative flex flex-col md:flex-row bg-neutral-800/70 shadow-md p-6">
	<div class="z-40 flex flex-col justify-between md:ml-6 w-full">
		<div class="w-full">
			<div class="whitespace-pre-line text-slate-200/90 mb-4 w-full">
				{#if incomingStream}
					{incomingStream}
				{:else}
					<div
						class="w-full h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate mb-2"
					/>
					<div
						class="w-full h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate mb-2"
					/>
					<div
						class="w-1/2 h-2 rounded-full bg-gradient-to-r from-white/20 via-white/10 to-white/20 background-animate"
					/>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	body {
		font-family: 'Inter', sans-serif;
	}

	.background-animate {
		background-size: 400%;

		-webkit-animation: AnimationName 3s ease infinite;
		-moz-animation: AnimationName 3s ease infinite;
		animation: AnimationName 3s ease infinite;
	}

	@keyframes AnimationName {
		0%,
		100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}
</style>
