import {NetworkScene} from "../lib/networkscene";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    public scene: NetworkScene;

    constructor(scene: NetworkScene, x: number, y: number) {
        super(scene, x, y, "crate");
        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.body.setAllowGravity(false);
        const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        this.rotation = targetAngle;
        // //create vector2 from positions and normalize, send to set velocity
        this.body.setVelocity(this.x - this.scene.input.activePointer.x, this.y - this.scene.input.activePointer.y);
    }

}