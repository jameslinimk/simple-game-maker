import { parseHref } from "$lib/conf"

export const get = async () => ({
	headers: { Location: parseHref("/docs/home") },
	status: 302
})
