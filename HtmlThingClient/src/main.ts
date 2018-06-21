import {TestScene} from "./scenes/testScene";

const config: GameConfig = {
	type: Phaser.WEBGL,
	width: 1280,
	height: 720,
	backgroundColor: 0x33ccff,
	scene: TestScene,
	input: {
		keyboard: true,
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
};

export class TestGame extends Phaser.Game {
	constructor() {
		super(config);
	}
}

window.onload = () => {
	const game = new TestGame();
	// resize();
	// window.addEventListener("resize", resize, false);
};
