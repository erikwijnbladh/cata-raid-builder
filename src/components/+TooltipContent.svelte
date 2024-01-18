<script lang="ts">
	export let spacing = '-translate-x-[13rem] -translate-y-[2rem]';
</script>

<div class="hidden group-hover:flex justify-center z-50">
	<div class="absolute {spacing} z-10 w-40">
		<slot />
	</div>
</div>
