import { initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth"
import { child, get, getDatabase, ref, remove, set, update } from "firebase/database"
import { writable } from "svelte/store"
import id from "./id"

initializeApp({
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

export const deleteUserData = async (optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]
	await remove(ref(database, `users/${auth.currentUser.uid}${optionalPath}`))
	return [true, null]
}

export const getUserData = async (optionalPath = ""): Promise<Response<any, "no data">> => {
	if (!auth.currentUser) return [null, "not logged in"]

	let error = false
	const snapshot = await get(child(ref(database), `users/${auth.currentUser.uid}${optionalPath}`)).catch((err) => {
		error = true
		return err
	})
	if (error || !snapshot.exists()) return [null, error || "no data"]
	return [snapshot.val(), null]
}

export const getProjects = () => <Promise<Response<{ [key: string]: string }>>>(<unknown>getUserData("/projects"))

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
	console.log(`%c${"=".repeat(3)} %c${label} %c${"=".repeat(3)}`, "color: green", "color: blue", "color: green")
	console.log(...messages)
	console.log(`%c${"=".repeat(label.length + 8)}`, "color: green")
}

// TODO run tests
export const generalTests = async () => {
	console.log("%cStarting generalTests...", "color: blue")
	log("user data", (await getUserData())[0])
}

// generalTests()

export const projectFuncsTest = async () => {
	console.log("%cStarting projectFuncsTest...", "color: blue")
	log("projects", (await getProjects())[0])
	console.log("Created a project with id of", await createProject("Hello world!"))
	log("projects", (await getProjects())[0])
}
// projectFuncsTest()

export const userObservable = writable(auth.currentUser)
onAuthStateChanged(auth, (user) => {
	userObservable.set(user)
})
