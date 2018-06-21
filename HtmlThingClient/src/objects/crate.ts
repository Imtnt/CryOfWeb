import {NetworkScene} from "../lib/networkscene";

export class Crate extends Phaser.Physics.Arcade.Sprite {
	public scene: NetworkScene;

	constructor(scene: NetworkScene, x: number, y: number) {
		super(scene, x, y, "crate");
		scene.add.existing(this);
		scene.physics.add.existing(this, false);
		this.body.setAllowGravity(false);
	}
}
