import PlayerImage from "../../images/player.png";
import PlayerOtherImage from "../../images/playerOther.png";
import CrateImage from "../../images/crate.png";
import {Player} from "../objects/player";
import * as io from "socket.io-client";
import {NetworkScene} from "../lib/networkscene";
import {OtherPlayer} from "../objects/otherplayer";
import {Crate} from "../objects/crate";

export class TestScene extends NetworkScene {
	public readonly width = 1280;
	public readonly height = 720;
	public obstacles: Phaser.Physics.Arcade.Group;
	public entities: Phaser.Physics.Arcade.Group;
	private player: Player;

	constructor() {
		super({
			key: "TestScene",
		});

		console.log("start scene");
		this.networkmanager = io.connect(`http://${window.location.hostname}:4343`);
	}

	public update(time: number, delta: number) {
		// this.player.update();
	}

	private preload() {
		console.log("scene preload");
		this.load.image("player", PlayerImage);
		this.load.image("playerOther", PlayerOtherImage);
		this.load.image("crate", CrateImage);
	}

	private create() {
		console.log("scene create");

		// enable physics debug drawing
		this.physics.world.createDebugGraphic();

		// setup obstacles group
		this.obstacles = this.physics.add.group(undefined, {
			allowGravity: false,
			dragX: 500,
			dragY: 500,
			allowRotation: true,
		});

		// setup entities group
		this.entities = this.physics.add.group(undefined, {
			allowGravity: false,
		});

		this.player = new Player(this, 200, 100);
		this.obstacles.add(new Crate(this, 400, 400));
		// this.physics.add.sprite(400, 400, "player");
		console.log("Connection id:", this.networkmanager.id);
		this.networkmanager.on("Player.List", (data: NetworkMessages.Player.List) => {
			console.log("Received player list from server");
			console.log(JSON.stringify(data, null , 2));
			for (const id of Object.keys(data)) {
				this.entities.add(new OtherPlayer(this, data[id].x, data[id].y, id));
			}
			this.networkmanager.emit("Player.New", {
				x: this.player.x,
				y: this.player.y,
				id: this.networkmanager.id,
			});
		});
		this.networkmanager.on("Player.New", (data: NetworkMessages.Player.New) => {
			console.log("new player joined");
			if (data.id === this.networkmanager.id) {
				return;
			}
			this.entities.add(new OtherPlayer(this, data.x, data.y, data.id));
		});
		this.networkmanager.on("test", (data: string) => {
			console.log(data);
		});
	}
}
