import consoleOutput from "./consoleOutput"
import { formatCodeExecution } from "./format"
import sGame from "./game/sGame"
import { addPopup } from "./popup"

export default async (code: string) => {
	code = <string>formatCodeExecution(code)
	if (!code) return

	// Separator
	consoleOutput.update((v) => [...v, { newConsoleOutput: true, date: Date.now() }])

	// Variables
	const print = (...data: any[]) => consoleOutput.update((v) => [...v, ...data])

	sGame.stop("restarting")
	sGame.start()

	try {
		await eval(code)
	} catch (error) {
		addPopup("Error while executing main function!", error)
		sGame.stop(error)
		return
	}
}
