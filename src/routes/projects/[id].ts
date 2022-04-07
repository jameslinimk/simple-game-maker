import { parseHref } from "$lib/conf"
import currentProject from "$lib/currentProject"

export const get = async ({ params }) => {
	currentProject.set(params.id)

	return {
		headers: { Location: parseHref(`/?project=${params.id}`) },
		status: 302
	}
}
