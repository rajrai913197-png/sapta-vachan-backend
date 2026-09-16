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


// ================= CORS =================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// ================= MIDDLEWARE =================

app.use(express.json());


// ================= UPLOAD =================

app.use(
  "/upload",
  express.static("upload")
);


// ================= ONLINE USERS =================

const onlineUsers = new Set();


// =====================================================
// SOCKET.IO
// =====================================================

io.on("connection", (socket) => {

  console.log(
    "SOCKET CONNECTED:",
    socket.id
  );


  // ===================================================
  // JOIN USER
  // ===================================================

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

    // Send online users to everyone

    io.emit(
      "onlineUsers",
      [...onlineUsers]
    );

  });


  // ===================================================
  // CHAT MESSAGE
  // ===================================================

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


  // ===================================================
  // CALL USER
  // ===================================================

  socket.on("call-user", (data) => {

    console.log(
      "📞 CALL USER:",
      data
    );

    if (!data) {

      console.log(
        "CALL DATA MISSING"
      );

      return;
    }

    const receiverId = String(
      data.receiverId
    );

    if (!receiverId) {

      console.log(
        "RECEIVER ID MISSING"
      );

      return;
    }

    console.log(
      `📞 CALLING USER: ${receiverId}`
    );

    io.to(receiverId).emit(
      "incoming-call",
      {
        callerId: socket.userId,

        callerName:
          data.callerName,

        callerImage:
          data.callerImage,

        callType:
          data.callType,

        offer:
          data.offer,
      }
    );

  });


  // ===================================================
  // CALL ACCEPTED
  // ===================================================

  socket.on("call-accepted", (data) => {

    console.log(
      "✅ CALL ACCEPTED:",
      data
    );

    if (!data) {
      return;
    }

    const callerId = String(
      data.callerId
    );

    if (!callerId) {

      console.log(
        "CALLER ID MISSING"
      );

      return;
    }

    io.to(callerId).emit(
      "call-accepted",
      {
        answer:
          data.answer,
      }
    );

  });


  // ===================================================
  // CALL REJECTED
  // ===================================================

  socket.on("call-rejected", (data) => {

    console.log(
      "❌ CALL REJECTED:",
      data
    );

    if (!data) {
      return;
    }

    const callerId = String(
      data.callerId
    );

    if (!callerId) {
      return;
    }

    io.to(callerId).emit(
      "call-rejected"
    );

  });


  // ===================================================
  // ICE CANDIDATE
  // ===================================================

  socket.on("ice-candidate", (data) => {

    console.log(
      "🧊 ICE CANDIDATE"
    );

    if (!data) {
      return;
    }

    const receiverId = String(
      data.receiverId
    );

    if (!receiverId) {
      return;
    }

    io.to(receiverId).emit(
      "ice-candidate",
      {
        candidate:
          data.candidate,

        senderId:
          socket.userId,
      }
    );

  });


  // ===================================================
  // CALL ENDED
  // ===================================================

  socket.on("call-ended", (data) => {

    console.log(
      "📴 CALL ENDED:",
      data
    );

    if (!data) {
      return;
    }

    const receiverId = String(
      data.receiverId
    );

    if (!receiverId) {
      return;
    }

    io.to(receiverId).emit(
      "call-ended"
    );

  });


  // ===================================================
  // DISCONNECT
  // ===================================================

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


// =====================================================
// EXPRESS ROUTES
// =====================================================

app.use(router);

app.use(routerProfile);

app.use(adminrouter);

app.use(interestrouter);

app.use(routerMsg);


// =====================================================
// SERVER
// =====================================================

server.listen(3300, () => {

  console.log(
    "SERVER RUNNING ON PORT 3300"
  );

});