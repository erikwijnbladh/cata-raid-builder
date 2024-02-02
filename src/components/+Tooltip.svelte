<script lang="ts">
	let isHovering = false;
</script>

<div
	class="relative"
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
>
	<slot />
	{#if isHovering}
		<div class="absolute z-50" let:spacing>
			<slot name="content" />
		</div>
	{/if}
</div>
