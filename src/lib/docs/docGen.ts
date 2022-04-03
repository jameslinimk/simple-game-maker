import fs from "fs"
import { marked } from "marked"
import path from "path"

const code: string[] = ["const pages = {"]
const categories: { [key: string]: string[] } = {}

const walkPages = (directory: string, category?: string) => {
	fs.readdirSync(directory).forEach((file) => {
		const absolute = path.join(directory, file)
		const lstat = fs.statSync(absolute)
		if (lstat.isDirectory()) return walkPages(absolute, file)
		if (!lstat.isFile() || !file.endsWith(".md")) return

		const fileName = file.slice(0, -3)

		const text = fs.readFileSync(absolute).toString("utf-8")

		if (category) {
			if (!categories[category]) categories[category] = [fileName]
			else categories[category].push(fileName)
		}

		code.push(`\t"${fileName}": ${JSON.stringify(marked.parse(text))},`)
	})
}
walkPages("./src/lib/docs/pages")
code.push("}", "")

code.push(
	"const indicesOf = (string: string, search: string, func: (index: number) => void, caseSensitive = false) => {",
	"\tif (!search.length) return []",
	"",
	"\tlet startIndex = 0",
	"\tlet index: number",
	"",
	"\tif (!caseSensitive) {",
	"\t\tstring = string.toLowerCase()",
	"\t\tsearch = search.toLowerCase()",
	"\t}",
	"",
	"\twhile ((index = string.indexOf(search, startIndex)) > -1) {",
	"\t\tfunc(index)",
	"\t\tstartIndex = index + search.length",
	"\t}",
	"}",
	"",
	"export default (page: string) => {",
	"\tpage = pages[page]",
	"\tif (!page) return pages[404]",
	"",
	'\tindicesOf(page, "", (i) => {',
	"\t\tconsole.log(i)",
	"\t})",
	"\treturn page",
	"}",
	""
)

code.push("export const categories: { [key: string]: string[] } = {")
Object.keys(categories).forEach((key) => code.push(`\t"${key}": ["${categories[key].join('", "')}"],`))
code.push("}", "")

fs.writeFileSync("./src/lib/docs/docs.ts", code.join("\n"))

console.log(`Finished in ${performance.now().toFixed(2)}ms!`)
