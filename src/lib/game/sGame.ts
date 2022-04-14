import { browser } from "$app/env"
import { addPopup } from "$lib/popup"
import type { Writable } from "svelte/store"
import { get, writable } from "svelte/store"

class sGame {
	running: Writable<boolean>
	gameLoop?: number

	// Events
	onFrame: (deltaTime: number) => any

	// Delta time
	timeThisRound: number
	timeLastRound: number

	canvas: HTMLCanvasElement

	constructor() {
		this.running = writable(false)

		this.onFrame = () => {}
	}

	async start() {
		if (!browser || !window) return
		this.running.set(true)

		addPopup("Starting game loop!", "", 1000, "green-600")

		console.log("Creating requestAnimationFrame")
		const frame = () => {
			this.timeThisRound = performance.now()
			this.onFrame((this.timeThisRound - this.timeLastRound) / 10 || 0)
			this.timeLastRound = this.timeThisRound

			this.gameLoop = window.requestAnimationFrame(frame)
		}
		this.gameLoop = window.requestAnimationFrame(frame)
		console.log("number", this.gameLoop)
	}

	stop(reason?: string) {
		if (!browser || !window || !get(this.running)) return

		this.running.set(false)

		addPopup("Stopping execution!", reason ? reason : "", 1000)

		window.cancelAnimationFrame(this.gameLoop)
	}
}

export default new sGame()

export interface Vector2 {
	x: number
	y: number
}
