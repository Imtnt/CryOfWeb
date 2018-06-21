import {NetworkScene} from "../lib/networkscene";

export class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
	public scene: NetworkScene;
	private id: string;
	private readonly speed = 200;
	private moveDir: Phaser.Math.Vector2;
	private target: Phaser.Math.Vector2;
	private networkmanager: SocketIOClient.Socket;

	constructor(scene: NetworkScene, x: number, y: number, id: string) {
		super(scene, x, y, "playerOther");
		this.id = id;
		this.networkmanager = this.scene.networkmanager;
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.target = new Phaser.Math.Vector2(x, y);

		this.networkmanager.on("Player.Movement", (data: NetworkMessages.Player.Movement) => {
			if (data.id === this.id) {
				this.target.x = data.x;
				this.target.y = data.y;
				this.moveDir = this.target.subtract(this.body.position).normalize();
				// console.log(this.target);
				this.angle = data.ang;
			}
		});

		this.networkmanager.on("Player.Destroy", (data: NetworkMessages.Player.Destroy) => {
			if (data.id === this.id) {
				this.destroy();
			}
		});
	}

	public preUpdate(time: number, delta: number) {
		if (this.moveDir != null) {
			if (this.body.position.distance(this.target) <= 150) {
				this.body.x = this.target.x;
				this.body.y = this.target.y;
				this.setVelocity(0, 0);
			} else {
				this.body.setVelocity(this.moveDir.x * this.speed, this.moveDir.y * this.speed);
			}
		}
	}
}
