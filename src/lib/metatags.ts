import { baseURL } from "./conf"

export default (options: { title: string; description?: string; urlRelativePath: string }) => ({
	title: options.title,
	titleTemplate: "%s | Simple Game Maker",
	description: options.description,
	canonical: `${baseURL}${options.urlRelativePath}`,
	openGraph: {
		url: `${baseURL}${options.urlRelativePath}`,
		title: "Simple Game Maker",
		description: options.description
	},
	twitter: {
		title: "Simple Game Maker",
		description: options.description
	}
})
