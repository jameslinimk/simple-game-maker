import { parseHref } from "$lib/conf"

export const get = async () => ({
	headers: { Location: parseHref("/login?type=signup") },
	status: 302
})
