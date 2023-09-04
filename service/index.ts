import { Server } from "socket.io";
import ws from "ws";
const broker = require("aedes")();
const server = require("net").createServer(broker.handle);
const httpServer = require("http").createServer();
const httpServerIO = require("http").createServer();

const port = 1883;
const wsPort = 8080; // WebSocket port
const socketIOPort = 9090; // Socket.IO port

const wss = new ws.Server({ noServer: true });

server.listen(port, function () {
  console.log("MQTT Broker server started and listening on port ", port);
});

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  socket.on("message", (message) => {
    console.log("WebSocket message received:", message.toString());
  });
});

httpServer.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});

httpServer.listen(wsPort, () => {
  console.log(`WebSocket server is listening on port ${wsPort}`);
});

// Create Socket.IO server
const io = new Server(httpServerIO, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Socket.IO client connected");

  // Handle incoming messages from Socket.IO clients
  socket.on("serverEvent", (data) => {
    console.log("Socket.IO message received:", data);

    // Publish the message to Aedes MQTT server
    broker.publish({
      topic: "mqtt_topic",
      payload: data,
    });
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Socket.IO client disconnected");
  });
});

httpServerIO.listen(socketIOPort, () => {
  console.log(`Socket.IO server is listening on port ${socketIOPort}`);
});