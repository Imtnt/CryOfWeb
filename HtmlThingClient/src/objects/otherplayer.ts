import {NetworkScene} from "../lib/networkscene";

export class OtherPlayer extends Phaser.GameObjects.Sprite {
	public scene: NetworkScene;
	private id: string;
	private readonly speed = 2;
	private networkmanager: SocketIOClient.Socket;

	constructor(scene: NetworkScene, x: number, y: number, id: string) {
		super(scene, x, y, "player");
		this.id = id;
		this.networkmanager = this.scene.networkmanager;
		scene.add.existing(this);

		this.networkmanager.on("Player.Movement", (data: NetworkMessages.Player.Movement) => {
			if (data.id === this.id) {
				this.x = data.x;
				this.y = data.y;
				this.angle = data.ang;
			}
		});

		this.networkmanager.on("Player.Destroy", (data: NetworkMessages.Player.Destroy) => {
			if (data.id === this.id) {
				this.destroy();
			}
		});
	}
}
