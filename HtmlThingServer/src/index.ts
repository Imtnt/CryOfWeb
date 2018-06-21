import {createServer} from "http";
import * as socket from "socket.io";

const server = createServer();
const ioServer = socket(server);
const players: NetworkMessages.Player.List = {};
server.listen(4343);

ioServer.on("connection", (con) => {
	console.log(`${con.id} connected`);
	setTimeout(() => {
		con.emit("Player.List", players);
	}, 100);
	con.on("Player.New", (data: NetworkMessages.Player.New) => {
		console.log(`Client ${con.id} sent ready: ${JSON.stringify(data)}`);
		players[con.id] = data;
		con.broadcast.emit("Player.New", data);
	});
	con.on("Player.Movement", (data: NetworkMessages.Player.Movement) => {
		// players[con.id].x = data.x;
		// players[con.id].y = data.y;
		con.broadcast.volatile.emit("Player.Movement", data);
	});
	con.on("disconnect", () => {
		console.log(`Player ${con.id} disconnected`);
		delete players[con.id];
		con.broadcast.emit("Player.Destroy", {id: con.id});
	});
});

console.log("Starting socket server on port 4343");
