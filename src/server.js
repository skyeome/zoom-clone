import http from "http";
// import WebSocket, { WebSocketServer } from "ws";
import { Server } from "socket.io";
import express from "express";

const PORT_NUMBER = 3000;
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () =>
  console.log(`Listening on http://localhost:${PORT_NUMBER}`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
});

httpServer.listen(PORT_NUMBER, handleListen);
