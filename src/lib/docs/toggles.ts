import { writable } from "svelte/store"
import { categories } from "./docs"

export default writable(Object.keys(categories).reduce((acc, curr) => {
	acc[curr] = false
	return acc
}, {}))
