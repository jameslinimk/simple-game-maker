import docs from "$lib/docs/docs"

export const get = ({ params }) => {
	return {
		body: {
			html: docs[params.id] || docs["404"],
			currentPage: params.id
		}
	}
}