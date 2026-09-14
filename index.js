const express = require("express");
const http = require("http");
const cors = require("cors");

require("./config/db");

const router = require("./router/UserRouter");
const routerProfile = require("./router/filterUser");
const adminrouter = require("./router/adminRouter");
const interestrouter = require("./router/intrestRouter");
const routerMsg = require("./router/messageRouter");


const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/upload",
  express.static("upload")
);

const onlineUsers = new Set();

io.on("connection", (socket) => {

  console.log(
    "SOCKET CONNECTED:",
    socket.id
  );

  socket.on("joinUser", (userId) => {

    if (!userId) {
      console.log(
        "USER ID NOT RECEIVED"
      );
      return;
    }

    const room = String(userId);

    socket.join(room);

    socket.userId = room;

    onlineUsers.add(room);

    console.log(
      `USER JOINED ROOM: ${room}`
    );

    console.log(
      "SOCKET ROOMS:",
      [...socket.rooms]
    );

    io.emit(
      "onlineUsers",
      [...onlineUsers]
    );
  });

  socket.on("sendMessage", (data) => {

    console.log(
      "🔥 SEND MESSAGE:",
      data
    );

    if (!data) {
      console.log(
        "MESSAGE DATA MISSING"
      );
      return;
    }

    const receiverId = String(
      data.receiver?._id ||
      data.receiver
    );

    if (!receiverId) {
      console.log(
        "RECEIVER ID MISSING"
      );
      return;
    }

    console.log(
      "🔥 SENDING TO ROOM:",
      receiverId
    );

    io.to(receiverId).emit(
      "receiveMessage",
      data
    );
  });

  socket.on("disconnect", () => {

    if (socket.userId) {

      onlineUsers.delete(
        socket.userId
      );

      io.emit(
        "onlineUsers",
        [...onlineUsers]
      );
    }

    console.log(
      "SOCKET DISCONNECTED:",
      socket.id
    );
  });

});

app.use(router);
app.use(routerProfile);
app.use(adminrouter);
app.use(interestrouter);
app.use(routerMsg);

server.listen(3300, () => {

  console.log(
    "SERVER RUNNING ON PORT 3300"
  );

});