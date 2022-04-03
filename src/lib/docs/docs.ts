const pages = {
	"404": '<h1 id="404-page-not-found">404 Page not found</h1>\n<p>This document page might have moved elsewhere.\nReturn to <a href="/docs/home">home</a></p>\n',
	home: '<h1 id="simple-game-maker---home">Simple Game Maker - Home</h1>\n<p>SGM is a tool to help beginners get into the world of Javascript (and soon typescript) while making awesome games to share with friends!</p>\n<h2 id="getting-started">Getting Started</h2>\n<ol>\n<li>Go to the <a href="/">main page</a></li>\n<li>Open up the <a href="/docs/intro">intro page</a></li>\n<li>Start making some games!</li>\n</ol>\n',
	test: '<h1 id="test-page">Test page</h1>\n'
}

const indicesOf = (string: string, search: string, func: (index: number) => void, caseSensitive = false) => {
	if (!search.length) return []

	let startIndex = 0
	let index: number

	if (!caseSensitive) {
		string = string.toLowerCase()
		search = search.toLowerCase()
	}

	while ((index = string.indexOf(search, startIndex)) > -1) {
		func(index)
		startIndex = index + search.length
	}
}

export default (page: string) => {
	page = pages[page]
	if (!page) return pages[404]

	indicesOf(page, "t", (i) => {
		console.log(i)
	})
	return page
}

export const categories: { [key: string]: string[] } = {
	Introduction: ["home", "test"]
}
