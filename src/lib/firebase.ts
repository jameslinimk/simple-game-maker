import chalk from "chalk"
import { initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth"
import { child, get, getDatabase, ref, set, update } from "firebase/database"
import id from "./id"

const app = initializeApp({
	apiKey: "AIzaSyCXscgIJHdk56IRXyNP8jaD8qg5Ivu5wRw",
	authDomain: "simple-game-maker.firebaseapp.com",
	projectId: "simple-game-maker",
	storageBucket: "simple-game-maker.appspot.com",
	messagingSenderId: "160001289841",
	appId: "1:160001289841:web:59433f5fe0ab7bb66f35d0",
	measurementId: "G-1YXYNG5LYC"
})
export const auth = getAuth()
setPersistence(auth, browserLocalPersistence)
export const database = getDatabase()

export type Response<DataType, ExtraErrors = null> = [data: DataType | null, error: "not logged in" | ExtraErrors | null]

export const updateUserData = async (data: { [key: string]: any }, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await update(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

export const overrideUserData = async (data: { [key: string]: any }, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await set(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

export const getUserData = async (optionalPath = ""): Promise<Response<any, "no data">> => {
	if (!auth.currentUser) return [null, "not logged in"]

	let error = false
	const snapshot = await get(child(ref(database), `users/${auth.currentUser.uid}${optionalPath}`)).catch(err => {
		error = true
		return err
	})
	if (error || !snapshot.exists()) return [null, error || "no data"]
	return [snapshot.val(), null]
}

export const getProjects = () => <Promise<Response<{ [key: string]: string }>>><unknown>getUserData("/projects")

/**
 * Creates a project and saves it to the user
 * @param code the code to start the project out with
 * @returns the PID (length = 5) (project id)
 */
export const createProject = async (code: string): Promise<Response<string>> => {
	const _projects = await getProjects()
	if (_projects[1] !== null) return [null, _projects[1]]

	const projects = Object.keys(_projects[0] || {})

	let pid = id()
	while (projects.includes(pid)) pid = id()

	await updateUserData({ [pid]: code }, "/projects")
	return [pid, null]
}

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */

const log = (label: string, ...messages: any[]) => {
	console.log(`${chalk.green("=".repeat(3))} ${chalk.blueBright(label)} ${chalk.green("=".repeat(3))}`)
	console.log(...messages)
	console.log(chalk.green("=".repeat(label.length + 8)))
}

// TODO run tests
export const generalTests = async () => {
	console.log(chalk.blue.bold("Starting generalTests..."))
	log("user data", (await getUserData())[0])
}

// generalTests()

export const projectFuncsTest = async () => {
	console.log(chalk.blue.bold("Starting projectFuncsTest..."))
	log("projects", (await getProjects())[0])
	console.log("Created a project with id of", await createProject("Hello world!"))
	log("projects", (await getProjects())[0])
}
// projectFuncsTest()
