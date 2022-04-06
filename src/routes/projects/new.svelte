<script lang="ts">
	import metatags from "$lib/metatags"
	import { MetaTags } from "svelte-meta-tags"
</script>

<div>New</div>

<MetaTags
	{...metatags({
		title: "Create project",
		description: "Create a new project",
		urlRelativePath: "/projects/new"
	})}
/>
