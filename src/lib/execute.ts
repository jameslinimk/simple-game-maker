import { formatCodeExecution } from "./format"
import _sGame from "./game/sGame"
import { addPopup } from "./popup"

export default async (code: string) => {
	const formattedCode = formatCodeExecution(code)
	if (!formattedCode) return

	const consoleOutput: any[] = [{ newConsoleOutput: true, date: Date.now() }]

	const sGame = _sGame
	sGame.stop()
	sGame.start()

	const tempLog = console.log
	console.log = (...data: any[]) => (consoleOutput.push(data))
	try {
		await eval(formattedCode)
	} catch (error) {
		addPopup("Error while executing main function!", error)
		sGame.stop()
		console.log = tempLog
		return [error]
	}

	console.log = tempLog
	return consoleOutput
}
