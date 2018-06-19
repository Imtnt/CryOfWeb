import PlayerImage from "../../images/player.png";
import {Player} from "../objects/player";
import * as io from "socket.io-client";
import {NetworkScene} from "../lib/networkscene";
import {OtherPlayer} from "../objects/otherplayer";

export class TestScene extends NetworkScene {
	private player: Player;

	constructor() {
		super({
			key: "TestScene",
		});

		this.networkmanager = io.connect(`http://${window.location.hostname}:4343`);
	}

	// public update(time: number, delta: number) {
	//
	// }

	private preload() {
		this.load.image("player", PlayerImage);
	}

	private create() {
		this.player = new Player(this, 200, 100);
		console.log("Connection id:", this.networkmanager.id);
		this.networkmanager.on("Player.List", (data: NetworkMessages.Player.List) => {
			console.log("Received player list from server");
			console.log(JSON.stringify(data, null , 2));
			for (const id of Object.keys(data)) {
				const other = new OtherPlayer(this, data[id].x, data[id].y, id);
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
			const other = new OtherPlayer(this, data.x, data.y, data.id);
		});
		this.networkmanager.on("test", (data: string) => {
			console.log(data);
		});
	}
}
