import fs from "fs"
import { marked } from "marked"
import path from "path"

const pages = new Map<string, string>()
const walkPages = async (directory: string) => {
	for (const file of fs.readdirSync(directory)) {
		const absolute = path.join(directory, file)
		const lstat = fs.statSync(absolute)
		if (lstat.isDirectory()) {
			walkPages(absolute)
			continue
		}
		if (!lstat.isFile() || !file.endsWith(".md")) continue

		const text = fs.readFileSync(absolute).toString("utf-8")
		pages.set(file.slice(0, -3), marked.parse(text))
	}
}
walkPages("./src/lib/docs")

export default (page: string) => pages.get(page) || pages.get("404")
export {
	pages
}
