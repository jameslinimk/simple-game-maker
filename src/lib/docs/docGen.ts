import fs from "fs"
import { marked } from "marked"
import path from "path"

const start = performance.now()

const code: string[] = ["export default {"]
const categories: { [key: string]: string[] } = {}

const parseText = (text: string) => text.replace(new RegExp('"', "g"), '\\"').replace(new RegExp("\n", "g"), "\\n")

const walkPages = async (directory: string) => {
	fs.readdirSync(directory).forEach(file => {
		const absolute = path.join(directory, file)
		const lstat = fs.statSync(absolute)
		if (lstat.isDirectory()) return walkPages(absolute)
		if (!lstat.isFile() || !file.endsWith(".md")) return

		const fileName = file.slice(0, -3)

		const text = fs.readFileSync(absolute).toString("utf-8")

		let infoLine: { category: string }
		try {
			infoLine = text.split("\n")[0].startsWith("INFO: ") && JSON.parse(text.split("\n")[0].slice(6))
		} catch (error) {
			console.log(` - Error while parsing INFO in ${file}!`)
		}
		if (!infoLine) return

		if (typeof infoLine?.category === "string") {
			if (!categories[infoLine.category]) categories[infoLine.category] = [fileName]
			else categories[infoLine.category].push(fileName)
			code.push(`\t"${fileName}": ${JSON.stringify(marked.parse(text.split("\n").slice(1).join("\n")))},`)
			return
		}

		code.push(`\t"${fileName}": ${JSON.stringify(marked.parse(text))},`)
	})
}
walkPages("./src/lib/docs/pages")
code.push("}", "")

code.push("export const categories: { [key: string]: string[] } = {")
Object.keys(categories).forEach(key => code.push(`\t"${key}": ["${categories[key].join('", "')}"],`))
code.push("}", "")

fs.writeFileSync("./src/lib/docs/docs.ts", code.join("\n"))

console.log(`Finished in ${(performance.now() - start).toFixed(2)}ms!`)
