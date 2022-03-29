const consonants = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
const vowels = ["a", "e", "i", "o", "u"]

const random = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

const templates: ("v" | "c")[][] = [
	["c", "v", "c", "v", "c"],
	["v", "c", "v", "c", "v"]
]

export default () => random(templates).map(v => v === "c" ? random(consonants) : random(vowels)).join("")
