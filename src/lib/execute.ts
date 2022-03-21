import _sGame from "./game/sGame"

export default async (code: string) => {
	const consoleOutput: any[] = [{ newConsoleOutput: true, date: Date.now() }]

	const sGame = _sGame
	sGame.stop()
	sGame.start()

	const tempLog = console.log
	console.log = (...data: any[]) => (consoleOutput.push(data))
	await eval(code)

	console.log = tempLog
	return consoleOutput
}
