import pages from "$lib/docs/docs"

export const get = ({ params }) => ({
	body: {
		html: pages[params.id] || pages[404],
		currentPage: params.id
	}
})
