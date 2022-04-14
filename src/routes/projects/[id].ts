import { parseHref } from "$lib/conf"

export const get = async ({ params }) => {
	return {
		headers: { Location: parseHref(`/?project=${params.id}`) },
		status: 302
	}
}
