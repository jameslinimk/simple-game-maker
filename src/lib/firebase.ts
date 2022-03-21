import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { child, get, getDatabase, ref, set, update } from "firebase/database"

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

const updateUserData = async (data: { [key: string]: any }, optionalPath = "") => {
	if (!auth.currentUser) return "not logged in"

	await update(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return true
}

const overrideUserData = async (data: { [key: string]: any }, optionalPath = "") => {
	if (!auth.currentUser) return "not logged in"

	await set(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return true
}

const getUserData = async (optionalPath = "") => {
	if (!auth.currentUser) return "not logged in"

	let error: false | string = false
	const snapshot = await get(child(ref(database), `users/${auth.currentUser.uid}${optionalPath}`)).catch(err => {
		error = err
		return false
	})
	if (error || typeof snapshot === "boolean" || !snapshot.exists()) return error || "no data"
	return snapshot.val()
}

const addProject = async (name: string, code: string) => {
	if (!auth.currentUser) return "not logged in"
	return updateUserData({ [name]: code }, "/projects")
}

export {
	app,
	auth,
	database,
	updateUserData,
	overrideUserData,
	getUserData,
	addProject
}

