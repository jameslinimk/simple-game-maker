<script context="module" lang="ts">
	import { parseHref } from "$lib/conf"

	export const load = () => ({
		status: 302,
		redirect: parseHref("/docs/home")
	})
</script>
