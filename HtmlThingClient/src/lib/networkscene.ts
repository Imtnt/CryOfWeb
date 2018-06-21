export abstract class NetworkScene extends Phaser.Scene {
	public networkmanager: SocketIOClient.Socket;
	public readonly width: number;
	public readonly height: number;
}
