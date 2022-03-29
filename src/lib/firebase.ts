import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
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
const auth = getAuth()
const database = getDatabase()

type Response<DataType, ExtraErrors = null> = [data: DataType | null, error: "not logged in" | ExtraErrors | null]

const updateUserData = async (data: { [key: string]: any }, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await update(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

const overrideUserData = async (data: { [key: string]: any }, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await set(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

const getUserData = async (optionalPath = ""): Promise<Response<any, "no data">> => {
	if (!auth.currentUser) return [null, "not logged in"]

	let error = false
	const snapshot = await get(child(ref(database), `users/${auth.currentUser.uid}${optionalPath}`)).catch(err => {
		error = true
		return err
	})
	if (error || !snapshot.exists()) return [null, error || "no data"]
	return [snapshot.val(), null]
}

const getProjects = () => <Promise<Response<{ [key: string]: string }>>><unknown>getUserData("/projects")

/**
 * Creates a project and saves it to the user
 * @param code the code to start the project out with
 * @returns the PID (length = 5) (project id)
 */
const createProject = async (code: string): Promise<Response<string>> => {
	const _projects = await getProjects()
	if (_projects[1] !== null) return [null, _projects[1]]

	const projects = Object.keys(_projects[0])

	let pid = id()
	while (!projects.includes(pid)) await projectExists(pid, projects)

	updateUserData({ [pid]: code }, "/projects")
	return [pid, null]
}

/**
 * Check to see if project exists
 * @param pid id of the project
 * @param projectKeys (optional) an existing array to check the id to
 * @returns wether or not the pid exists
 */
const projectExists = async (pid: string, projectKeys?: string[]) => {
	if (projectKeys) return projectKeys.includes(pid)

	const _projects = await getProjects()
	if (_projects[1] !== null) return [null, _projects[1]]
	return Object.keys(_projects[0]).includes(pid)
}

const updateProject = async (pid: string, newCode: string): Promise<Response<boolean, "pid doesn't exist">> => {
	const exists = await projectExists(pid)
	if (!exists[0]) return [null, "pid doesn't exist"]
	if (exists[1] !== null) return [null, exists[1]]

	updateUserData({ [pid]: newCode }, "/projects")
}

/* -------------------------------------------------------------------------- */
/*                                    Tests                                   */
/* -------------------------------------------------------------------------- */

// TODO
export const generalTests = () => {

}
export const projectFuncsTest = () => {

}

export {
	app,
	auth,
	database,
	updateUserData,
	overrideUserData,
	getUserData,

	getProjects,
	createProject,
	projectExists,
	updateProject
}
export type {
	Response
}


