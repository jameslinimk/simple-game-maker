import { publish } from "gh-pages"

publish("build", (error) => {
	if (error) return console.error(error);
	console.log("Built!")
})
