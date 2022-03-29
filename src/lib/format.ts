import type { Ace } from "ace-builds"
import escodegen from "escodegen"
import type { parsedTokens, Statement } from "esprima-next"
import esprima, { Syntax } from "esprima-next"
import { format } from "prettier"
import parserBabel from "prettier/esm/parser-babel.mjs"
import { addPopup } from "./popup"

export default (editor: Ace.Editor, prettierFormat: {}) => {
	if (editor.session.getAnnotations().filter((annotation) => annotation.type === "error").length > 0) return addPopup("Error while formatting", "Please fix all problems in your code first!")

	try {
		editor.session.setValue(
			format(editor.getValue(), {
				...prettierFormat,
				parser: "babel",
				plugins: [parserBabel],
			})
		)
	} catch (error) {
		console.log("%cError (formatting code):", "color: #DC2626; font-weight: 800", error)
		return addPopup("Error while formatting", "Please look for errors in your code!")
	}

	addPopup("Formatted!", "", 1000, "green-600")
}

const varName = "__iterationCounts__"
const loopCheckHead: Statement[] = (<any>esprima.parse(`const ${varName} = {}`).body[0])
const loopCheck = (id: string): Statement[] => (<any>esprima.parse(`while(true){if (${varName}["${id}"] === undefined) ${varName}["${id}"] = 0;${varName}["${id}"]++;if (${varName}["${id}"] >= 15000) throw new Error("Loop exceeds 15000 iterations. Check for an infinite loop!")}`).body[0]).body.body
const formatCodeExecution = (code: string) => {
	let tokens: parsedTokens | Statement[]
	try {
		tokens = esprima.parse(code)
	} catch (error) {
		console.log("%cError (instrumenting code):", "color: #DC2626; font-weight: 800", error)
		return addPopup("There was an error while executing!", error)
	}

	(<any>tokens.body).unshift(loopCheckHead)

	tokens.body.filter(body => [
		Syntax.WhileStatement,
		Syntax.DoWhileStatement,
		Syntax.ForInStatement,
		Syntax.ForStatement,
		Syntax.ForInStatement,
		Syntax.ForOfStatement
	].includes(body.type)).forEach((loop: any, i) => {
		(<any>loop).body.body = [...loopCheck(`${i}`), ...(<any>loop).body.body]
	})

	return escodegen.generate(tokens)
}

export {
	formatCodeExecution
}
