import consoleOutput from "./consoleOutput"
import { formatCodeExecution } from "./format"
import _sGame from "./game/sGame"
import { addPopup } from "./popup"

export default async (code: string) => {
	code = <string>formatCodeExecution(code)
	if (!code) return

	const sGame = _sGame
	sGame.stop()
	sGame.start()

	// Separator
	consoleOutput.update(v => [...v, { newConsoleOutput: true, date: Date.now() }])

	const tempLog = console.log
	console.log = (...data: any[]) => consoleOutput.update(v => [...v, ...data])

	try {
		await eval(code)
	} catch (error) {
		addPopup("Error while executing main function!", error)
		sGame.stop(error)
		console.log = tempLog
		return
	}

	console.log = tempLog
}
