<script>
	import Tailwindcss from '../components/icons/+tailwindcss.svelte';
	import IcSvelte from '../components/icons/+ic-svelte.svelte';
	import IcSkeleton from '../components/icons/+ic-skeleton.svelte';
	import IcVercel from '../components/icons/+ic-vercel.svelte';
</script>

<div class="flex flex-row justify-center border-t border-tertiary-800 py-1 gap-4">
	<a href="https://kit.svelte.dev/" target="_blank" class="hover:opacity-70">
		<IcSvelte />
	</a>
	<a href="https://www.skeleton.dev/" target="_blank" class="hover:opacity-70">
		<IcSkeleton />
	</a>
	<a href="https://tailwindcss.com/" target="_blank" class="hover:opacity-70">
		<Tailwindcss />
	</a>
	<a href="https://vercel.com/" target="_blank" class="hover:opacity-70">
		<IcVercel />
	</a>
</div>
