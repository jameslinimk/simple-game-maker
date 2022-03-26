import docs from "$lib/docs/docs"

export async function get({ params }) {
	return {
		body: { html: docs((<string>params.id).toLowerCase()) }
	}
}