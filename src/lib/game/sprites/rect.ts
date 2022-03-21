import type { Vector2 } from "../sGame"

export default class {
	width: number
	height: number
	location: Vector2
	get topLeft(): Vector2 {
		return {
			x: this.location.x - this.width / 2,
			y: this.location.y - this.height / 2
		}
	}
	get top() {
		return this.topLeft.y
	}
	get left() {
		return this.topLeft.x
	}
}