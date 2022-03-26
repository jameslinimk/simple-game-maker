import docs, { pages } from "$lib/docs/docs"

export async function get({ params }) {
	return {
		body: {
			html: docs((<string>params.id).toLowerCase()),
			all: [...pages.keys()].filter(key => key !== "404")
		}
	}
}