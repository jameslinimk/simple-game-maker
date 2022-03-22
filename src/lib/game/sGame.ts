import { writable } from "svelte/store"

class sGame {
	private _running: boolean
	public get running(): boolean {
		return this._running
	}
	gameLoop?: NodeJS.Timeout

	// Events
	onFrame: (deltaTime: number) => any

	// Delta time
	timeThisRound: number
	timeLastRound: number

	canvas: HTMLCanvasElement
	constructor() {
		this._running = false
		this.onFrame = (dt) => { console.log("DT:", dt) }
	}

	async start() {
		this._running = true
		running.set(true)
		this.gameLoop = setInterval(() => {
			this.timeThisRound = performance.now()
			this.onFrame((this.timeThisRound - this.timeLastRound) / 10 || 0)
			this.timeLastRound = this.timeThisRound
		}, 1000 / 60)
	}

	stop() {
		if (!this._running) return

		this._running = false
		running.set(false)
		clearInterval(this.gameLoop)
	}
}

const running = writable(false)
export {
	running
}
export type {
	Vector2
}


export default new sGame()

interface Vector2 {
	x: number
	y: number
}


