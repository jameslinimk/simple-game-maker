import fs from "fs"
import { JSDOM } from "jsdom"
import { marked } from "marked"
import path from "path"
import { parseHref } from "../../lib/conf.js"

const code = ["export default {"]
const categories = {}
const descriptions = {}

const walkPages = (/** @type {string} */ directory, /** @type {string} */ category) => {
	fs.readdirSync(directory).forEach((file) => {
		const absolute = path.join(directory, file)
		const lstat = fs.statSync(absolute)
		if (lstat.isDirectory()) return walkPages(absolute, file)
		if (!lstat.isFile() || !file.endsWith(".md")) return

		const fileName = file.slice(0, -3)

		let text = fs.readFileSync(absolute).toString("utf-8")

		if (category) {
			if (!categories[category]) categories[category] = [fileName]
			else categories[category].push(fileName)
		}

		/* ------------------------------- Extra data ------------------------------- */
		const fLine = text.split("\n")[0]
		if (fLine.startsWith("INFO: ")) {
			let data
			try {
				data = JSON.parse(fLine.slice(5))
			} catch (_) {
				console.log(`Failed to parse data for ${fileName}!`)
			}

			if (typeof data["description"] === "string") {
				descriptions[fileName] = data["description"]
			}

			text = text.split("\n").slice(1).join("\n")
		}

		/* --------------------------------- Testing -------------------------------- */
		const doc = new JSDOM(marked.parse(text))
		doc.window.document.querySelectorAll("a").forEach((e) => (e.href = parseHref(e.href)))

		code.push(`\t"${fileName}": ${JSON.stringify(doc.serialize().slice(25).slice(0, -15))},`)
	})
}
walkPages("./src/lib/docs/pages")
code.push("}", "")

if (Object.keys(categories).length) {
	code.push("export const categories: { [key: string]: string[] } = {")
	Object.keys(categories).forEach((key) => code.push(`\t${JSON.stringify(key)}: [${JSON.stringify(categories[key].join('", "'))}],`))
	code.push("}", "")
}

if (Object.keys(descriptions).length) {
	code.push("export const descriptions: { [key: string]: string } = {")
	Object.keys(descriptions).forEach((key) => code.push(`\t${JSON.stringify(key)}: ${JSON.stringify(descriptions[key])}`))
	code.push("}", "")
}

fs.writeFileSync("./src/lib/docs/docs.ts", code.join("\n"))

console.log(`Finished in ${performance.now().toFixed(2)}ms!`)
