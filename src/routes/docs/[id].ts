import docs from "$lib/docs/docs"

export const get = ({ params }) => ({
	body: {
		html: docs(params.id),
		currentPage: params.id
	}
})
