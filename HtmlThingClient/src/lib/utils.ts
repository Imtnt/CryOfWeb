export class Key {
	public readonly code: number;
	public isDown = false;
	public isUp = true;
	public press: () => void;
	public release: () => void;

	constructor(key: number, press?: () => void, release?: () => void) {
		this.code = key;
		this.press = press;
		this.release = release;

		window.addEventListener("keydown", (event: KeyboardEvent) => {
			if (event.keyCode === this.code) {
				if (this.isDown && this.press) {this.press(); }
				this.isDown = false;
				this.isUp = true;
			}
			event.preventDefault();
		}, false);
		window.addEventListener("keyup", (event: KeyboardEvent) => {
			if (event.keyCode === this.code) {
				if (this.isUp && this.release) {this.release(); }
				this.isDown = true;
				this.isUp = false;
			}
			event.preventDefault();
		}, false);
	}
}
