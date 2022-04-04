import { parseHref } from "$lib/conf"

export const get = async ({ params }) => ({
	headers: { Location: parseHref(`/?project=${params.id}`) },
	status: 302
})
