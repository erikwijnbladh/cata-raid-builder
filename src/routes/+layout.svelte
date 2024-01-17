<script>
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		AppRail,
		AppRailTile,
		AppRailAnchor,
		LightSwitch
	} from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import Footer from '../components/+footer.svelte';
	initializeStores();
</script>

<AppShell scrollbarGutter="stable">
	<svelte:fragment slot="header">
		<AppBar class="border-b border-tertiary-800">
			<svelte:fragment slot="lead">
				<a class="btn btn-sm variant-ghost-surface" href="/">
					<strong class="text-xl">Home</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://twitch.tv/yorks_"
					target="_blank"
					rel="noreferrer"
				>
					Twitch
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://open.spotify.com/user/erikwijnbladh?si=b9af7c8895d44c0e"
					target="_blank"
					rel="noreferrer"
				>
					Spotify
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/erikwijnbladh"
					target="_blank"
					rel="noreferrer"
				>
					Github
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://erikwijnbladh.se"
					target="_blank"
					rel="noreferrer"
				>
					Website
				</a>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<div class="max-w-full mx-auto py-5 md:pt-10 md:pb-20">
		<slot />
	</div>
	<svelte:fragment slot="footer">
		<Footer />
	</svelte:fragment>
</AppShell>
