<script>
	import MagnifyingGlass from 'virtual:icons/ph/magnifying-glass'

	export let value = '';
</script>

<label for="user-search">
	<span class="icon">
		<MagnifyingGlass style="height: 100%; width: 100%" />
	</span>
	<input id="user-search" type="search" bind:value={value} />
</label>

<style lang="scss">
	label {
		position: relative;
		height: fit-content;
    width: fit-content;

		.icon {
			position: absolute;
			top: 50%;
			left: 8px;
			transform: translateY(-50%);
			height: 16px;
			width: 16px;
		}

    input {
			border: none;
			outline: none;
			border-radius: 4px;
      padding: 8px 16px 8px 32px;
      width: 320px;
			background: #aba3b850;
			transition: all 0.2s ease-in-out;

			&:hover {
        background: #aba3b870;
				scale: 1.01;
			}

      &:focus {
        background: #aba3b890;
        scale: 1.01;
      }
    }
	}
</style>