<script lang="ts">
	import { onMount } from 'svelte';
	import PlusIcon from 'virtual:icons/ph/plus';
	import MinusIcon from 'virtual:icons/ph/minus';
	import CornersOutIcon from 'virtual:icons/ph/corners-out';
	import DownloadIcon from 'virtual:icons/ph/download-simple';
	import ExportIcon from 'virtual:icons/ph/export';
	import XIcon from 'virtual:icons/ph/x';
	import type { MemberList } from '../types/members';
	import { renderMembers } from '../utils/fabric/renderer/member';
	import { CustomCanvas } from '$lib/fabric/canvas';
	import { exportCards } from '../utils/fabric/export';
	import { downloadFromURL } from '../utils/download.js';

	export let members: MemberList;
	let canvas: CustomCanvas | null = null;
	let exportedURLs: Array<{url: string, username: string}> = [];
	let sidebar = false;

	$: {
		if (canvas) {
			renderMembers(members, canvas);
		}
	}

	const exportImages = () => {
		if (canvas) {
			// export images using export cards, and show the sidebar
			exportedURLs = exportCards(canvas);
			sidebar = true;
		}
	};

	const closeExportSidebar = () => {
		sidebar = false;
	};

	const zoomIn = () => {
		if (!canvas) return;

		canvas.zoomIn()
	}

	const zoomOut = () => {
		if (!canvas) return;

		canvas.zoomOut()
	}

	const resetZoom = () => {
		if (!canvas) return;

		canvas.resetZoom()
	}

	onMount(() => {
		// make canvas using CustomCanvas class
		const canvasEl = document.querySelector<HTMLCanvasElement>('#canvas');

		if (!canvasEl) return;

		const { height, width } = canvasEl.getBoundingClientRect();

		canvas = new CustomCanvas(canvasEl, {
			height,
			width
		});

		return () => {
			canvas?.destroy();
		};
	});
</script>

<div class="layout">
	<div class="container">
		<canvas id="canvas" />
		<div class="zoomContainer">
			<button class="iconButton" on:click={zoomIn}>
				<PlusIcon />
			</button>
			<button class="iconButton" on:click={zoomOut}>
				<MinusIcon />
			</button>
			<button class="iconButton" on:click={resetZoom}>
				<CornersOutIcon />
			</button>
			<button class="iconButton" on:click={exportImages}>
				<ExportIcon />
			</button>
		</div>
	</div>
	{#if sidebar}
		<div class="sidebar">
			<button class="close" on:click={closeExportSidebar}>
				<XIcon />
			</button>
			{#if exportedURLs.length > 0}
				{#each exportedURLs as card}
					<div class="imageContainer">
						<img src={card.url} alt="" class="card" />
						<button class="download" on:click={() => downloadFromURL(card.url, card.username)}>
							<DownloadIcon />
						</button>
					</div>
				{/each}
			{:else}
				No exported cards
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
  .layout {
    display: flex;
    align-items: center;
    flex-grow: 1;
    width: 100%;

    .container {
      width: 100%;
      height: 100%;
      position: relative;
      border-radius: 4px;
      background: #aba3b820;

      #canvas {
        width: 100%;
        height: 100%;
      }

      .zoomContainer {
        display: flex;
        flex-direction: column;
        gap: 0;
        position: absolute;
        bottom: 16px;
        right: 16px;
        width: fit-content;
        height: fit-content;
        border: 1px solid #12121270;

        .iconButton {
          border: none;
          border-bottom: 1px solid #12121270;
          outline: none;
          padding: 4px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease-in-out;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #aba3b830;
          }
        }
      }
    }

    .sidebar {
      position: fixed;
      width: 320px;
      height: 100%;
      max-width: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;

      padding: 48px 24px 24px;
      background: white;
      border-left: 1px solid #12121250;
      box-shadow: 0 24px 24px rgba(0, 0, 0, 0.2);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .close {
        height: 24px;
        width: 24px;
        padding: 4px;
        transition: all 0.2s ease-in-out;
        border-radius: 50%;
        position: absolute;
        top: 12px;
        left: 20px;
        cursor: pointer;
        border: none;
        outline: none;

        &:hover {
          scale: 1.1;
          background: #12121220;
        }
      }

			.imageContainer {
        position: relative;

				img {
					width: 100%;
					object-fit: contain;
				}

				.download {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 28px;
					width: 28px;
					padding: 4px;
					transition: all 0.2s ease-in-out;
					border-radius: 50%;
					position: absolute;
					bottom: 8px;
					right: 8px;
					cursor: pointer;
					border: 1px solid transparent;
					outline: none;

					&:hover {
						background: #12121210;
						border-color: black;
					}
				}
			}

    }
  }
</style>