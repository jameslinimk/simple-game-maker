import { writable } from "svelte/store"

const popups = writable(<[title: string, description: string, id: number, color: string][]>[])
let id = 0
export const addPopup = (title: string, description: string, delay = 5000, color = "red-600") => {
	id++
	popups.update(v => [...v, [title, description, id, color]])
	const thisId = id
	setTimeout(() => popups.update(v => v.filter(v => v[2] !== thisId)), delay)
}

export default popups
