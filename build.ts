import fs from "fs"
import { publish } from "gh-pages"

fs.writeFileSync("./build/.nojekyll", "")
publish("build", (error) => {
	if (error) return console.error(error)
	console.log("Built!")
})
