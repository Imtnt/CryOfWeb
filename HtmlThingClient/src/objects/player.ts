import {NetworkScene} from "../lib/networkscene";
import {TestScene} from "../scenes/testScene";

export class Player extends Phaser.Physics.Arcade.Sprite {
	public scene: NetworkScene;
	private readonly speed = 200;
	private readonly sendRate = 200;
	private upKey: Phaser.Input.Keyboard.Key;
	private downKey: Phaser.Input.Keyboard.Key;
	private leftKey: Phaser.Input.Keyboard.Key;
	private rightKey: Phaser.Input.Keyboard.Key;
	private networkmanager: SocketIOClient.Socket;

	constructor(scene: TestScene, x: number, y: number) {
		super(scene, x, y, "player");
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
		this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.networkmanager = this.scene.networkmanager;
		this.body.setAllowGravity(false);
		this.body.setCollideWorldBounds(true);
		this.scene.physics.add.collider(this, scene.obstacles);

		setInterval(this.networkSync.bind(this), this.sendRate);
	}

	public preUpdate() {
		// console.log(this.x)
		this.handleInput();
		this.faceMouse();
		// this.networkSync();
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
		this.body.rotation = targetAngle;
	}

	private handleInput() {
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

		this.setVelocity(vx, vy);
		// if (this.x + vx <= 0) {
		// 	this.x = 0;
		// } else if (this.x + vx >= this.scene.width) {
		// 	this.x = this.scene.width;
		// } else {
		// 	this.x += vx;
		// }
		//
		// if (this.y + vy <= 0) {
		// 	this.y = 0;
		// } else if (this.y + vy >= this.scene.height) {
		// 	this.y = this.scene.height;
		// } else {
		// 	this.y += vy;
		// }
	}
}
