<script>
	/**
	 * @type {any}
	 */
	export let incomingStream;
</script>

<div class="relative flex flex-col md:flex-row bg-neutral-800/70 shadow-md p-6">
	<div
		class="bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-900 background-animate text-white/50 flex items-center justify-center h-[250px] flex-none w-1/5 "
	>
		<svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M0.75 2.25C0.75 1.42157 1.42157 0.75 2.25 0.75H21.75C22.5784 0.75 23.25 1.42157 23.25 2.25V21.75C23.25 22.5784 22.5784 23.25 21.75 23.25H2.25C1.42157 23.25 0.75 22.5784 0.75 21.75V2.25Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5.25 17.25L8.712 12.634C8.97285 12.286 9.37191 12.0683 9.80575 12.0374C10.2396 12.0065 10.6655 12.1654 10.973 12.473L12 13.5L15.3 9.1C15.5833 8.72229 16.0279 8.5 16.5 8.5C16.9721 8.5 17.4167 8.72229 17.7 9.1L20.37 12.66"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M6.375 8.25C7.41053 8.25 8.25 7.41053 8.25 6.375C8.25 5.33947 7.41053 4.5 6.375 4.5C5.33947 4.5 4.5 5.33947 4.5 6.375C4.5 7.41053 5.33947 8.25 6.375 8.25Z"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.75 17.25H23.25"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
	<div class="md:hidden z-10 absolute inset-0 bg-cover bg-center">
		<div class="w-full h-full bg-black/80 bg-blur-sm" />
	</div>

	<div class="z-40 flex flex-col justify-between md:ml-6 w-full">
		<div class="w-full">
			<div class="flex items-end mb-4">
				<div class="flex items-end">
					<div
						class="bg-gradient-to-r from-white/90 via-white/40 to-white/90 background-animate h-6 w-40 rounded-full"
					/>
					<div
						class="h-3 bg-gradient-to-r from-white/50 via-white/20 to-white/50 background-animate w-20 rounded-full ml-2"
					/>
				</div>
			</div>
			<div class="text-slate-200/90 mb-4 w-full">
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
