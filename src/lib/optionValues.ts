import { writable } from "svelte/store"

export default writable(
	<{ [key: string]: [ { [key: string]: boolean }, { [key: string]: string } ] }>{}
)