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

type Response<T> = [data: T | null, error: string | null]

const updateUserData = async (data: any, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await update(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

const overrideUserData = async (data: any, optionalPath = ""): Promise<Response<true>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	await set(ref(database, `users/${auth.currentUser.uid}${optionalPath}`), data)
	return [true, null]
}

const getUserData = async (optionalPath = ""): Promise<Response<any>> => {
	if (!auth.currentUser) return [null, "not logged in"]

	let error = false
	const snapshot = await get(child(ref(database), `users/${auth.currentUser.uid}${optionalPath}`)).catch(err => {
		error = true
		return err
	})
	if (error || !snapshot.exists()) return [null, error || "no data"]
	return [snapshot.val(), null]
}

export {
	app,
	auth,
	database,
	updateUserData,
	overrideUserData,
	getUserData
}
export type {
	Response
}


