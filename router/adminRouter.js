const express = require("express")
const {getAllUsers,deleteUser}=require("../controller/AdminController")
let adminrouter = express.Router()
adminrouter.get("/getalluser",getAllUsers)
adminrouter.delete("/deleteUser/:id",deleteUser)
module.exports = adminrouter