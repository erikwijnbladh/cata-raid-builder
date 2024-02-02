<script lang="ts">
	export let spacing = '-translate-x-[10rem] -translate-y-[2rem]';
</script>

<div class={`absolute ${spacing} z-10 w-40`}>
	<slot />
</div>
