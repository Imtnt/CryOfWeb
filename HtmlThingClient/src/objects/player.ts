import {NetworkScene} from "../lib/networkscene";

export class Player extends Phaser.GameObjects.Sprite {
	public scene: NetworkScene;
	private readonly speed = 200;
	private upKey: Phaser.Input.Keyboard.Key;
	private downKey: Phaser.Input.Keyboard.Key;
	private leftKey: Phaser.Input.Keyboard.Key;
	private rightKey: Phaser.Input.Keyboard.Key;
	private networkmanager: SocketIOClient.Socket;

	constructor(scene: NetworkScene, x: number, y: number) {
		super(scene, x, y, "player");

		this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.networkmanager = this.scene.networkmanager;
		scene.add.existing(this);
	}

	public preUpdate(time: number, delta: number) {
		this.handleInput(delta / 1000);
		this.faceMouse();
		this.networkSync();
	}

	private networkSync() {
		const movement: NetworkMessages.Player.Movement = {
			id: this.networkmanager.id,
			x: Math.trunc(this.x),
			y: Math.trunc(this.y),
			ang: Math.trunc(this.angle),
		};

		this.networkmanager.emit("Player.Movement", movement);
	}

	private faceMouse() {
		const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);

		this.rotation = targetAngle;
	}

	private handleInput(delta: number) {
		let vx = 0;
		let vy = 0;

		if (this.upKey.isDown) {
			vy = -this.speed;
		}
		if (this.downKey.isDown) {
			vy = this.speed;
		}
		if (this.leftKey.isDown) {
			vx = -this.speed;
		}
		if (this.rightKey.isDown) {
			vx = this.speed;
		}

		if ((this.upKey.isDown && this.downKey.isDown) || (!this.upKey.isDown && !this.downKey.isDown)) {
			vy = 0;
		}

		if ((this.leftKey.isDown && this.rightKey.isDown) || (!this.leftKey.isDown && !this.rightKey.isDown)) {
			vx = 0;
		}

		this.x += vx * delta;
		this.y += vy * delta;
	}
}
