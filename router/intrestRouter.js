const express = require("express");
const {
sendInterest,
  getReceivedInterests,
  acceptInterest,
  rejectInterest,
  getMyConnections
} = require("../controller/intrestController");
const interestrouter = express.Router();
interestrouter.post("/sendInterest", sendInterest);
interestrouter.get("/receivedInterests/:userId", getReceivedInterests);
interestrouter.put("/acceptInterest/:interestId", acceptInterest);
interestrouter.put("/rejectInterest/:interestId", rejectInterest);
interestrouter.get("/myConnections/:userId", getMyConnections);
module.exports = interestrouter;