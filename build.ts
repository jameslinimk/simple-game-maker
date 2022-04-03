import fs from "fs"
import { publish } from "gh-pages"

fs.writeFileSync("./build/.nojekyll", "")
publish("build", { dotfiles: true }, (error) => {
	if (error) return console.error(error)
	console.log("Built!")
})
