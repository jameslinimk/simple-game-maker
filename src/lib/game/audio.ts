export default class {
	private audio: HTMLAudioElement

	constructor(source: string) {
		try {
			this.audio = new Audio(source)
		} catch (error) {
			throw new Error(`Given url of "${source}" is not a valid URL/audio file!`)
		}
	}

	play() {
		this.audio.loop = false
		this.audio.play()
	}

	playLooped() {
		this.audio.loop = true
		this.audio.play()
	}

	pause() {
		this.audio.pause()
	}
}