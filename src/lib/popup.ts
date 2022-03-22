import { writable } from "svelte/store"

const popups = writable(<[title: string, description: string, id: number][]>[])
let id = 0
const addPopup = (title: string, description: string, delay = 1750) => {
	id++
	popups.update(v => [...v, [title, description, id]])
	const thisId = id
	setTimeout(() => popups.update(v => v.filter(v => v[2] !== thisId)), delay)
}

export default popups

export {
	addPopup
}

