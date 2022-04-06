import type { Ace } from "ace-builds"
import escodegen from "escodegen"
import { parse } from "espree"
import { format } from "prettier"
import parserBabel from "prettier/esm/parser-babel.mjs"
import { addPopup } from "./popup"
import { esEdition } from "./version"

export default (editor: Ace.Editor, prettierFormat: {}) => {
	if (editor.session.getAnnotations().filter((annotation) => annotation.type === "error").length > 0)
		return addPopup("Error while formatting", "Please fix all problems in your code first!")

	try {
		editor.session.setValue(
			format(editor.getValue(), {
				...prettierFormat,
				parser: "babel",
				plugins: [parserBabel]
			})
		)
	} catch (error) {
		console.log("%cError (formatting code):", "color: #DC2626; font-weight: 800", error)
		return addPopup("Error while formatting", "Please look for errors in your code!")
	}

	addPopup("Formatted!", "", 1000, "green-600")
}

const varName = "__iterationCounts__"
const loopCheckHead = parse(`${esEdition >= 6 ? "const" : "var"} ${varName} = {}`, { ecmaVersion: esEdition }).body[0]

const loopCheck = (id: number) =>
	parse(
		`if (${varName}["${id}"] === undefined) ${varName}["${id}"] = 0;${varName}["${id}"]++;if (${varName}["${id}"] >= 15000) throw new Error("Loop exceeds 15000 iterations. Check for an infinite loop!")`
	).body
const loopNames = ["WhileStatement", "DoWhileStatement", "ForInStatement", "ForStatement", "ForInStatement", "ForOfStatement"]

export const formatCodeExecution = (code: string) => {
	let parsed: any
	try {
		parsed = parse(code, { ecmaVersion: esEdition })
	} catch (error) {
		console.log("%cError (instrumenting code):", "color: #DC2626; font-weight: 800", error)
		return addPopup("There was an error while executing!", error)
	}
	parsed.body = [loopCheckHead, ...parsed.body]

	const loops = parsed.body.filter((body: any) => loopNames.includes(body.type))
	loops.forEach((node: any, i: number) => (node.body.body = [...loopCheck(i), ...node.body.body]))

	return escodegen.generate(parsed)
}
