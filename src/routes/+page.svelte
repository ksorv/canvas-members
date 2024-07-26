<script lang="ts">
	import Input from '../components/input.svelte';
	import Canvas from '../components/canvas.svelte';
	import { searchMembers } from '../utils/array';

	type PageData = App.PageData;

	export let data: PageData;
	let search = '';
	let timeout: number;
	let debouncedSearch = '';

	const handleDebouncedSearch = (search: string) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			debouncedSearch = search;
		}, 300)
	}

	$: handleDebouncedSearch(search);

	// use debounced search here for better perf and animations
	$: members = searchMembers(data.members, 'username', debouncedSearch);
</script>

<div class="container">
	<Input bind:value={search} />
	<Canvas members={members} />
</div>

<style>
	.container {
			height: 100%;
			width: 100%;
			padding: 16px;

			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 32px;
	}
</style>