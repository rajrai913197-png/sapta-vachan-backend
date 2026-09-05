const express = require("express")
const {filterUser,ageCat,getCity,getGender,community}= require("../controller/profile")
const routerProfile = express.Router()
routerProfile.get('/filterUser',filterUser)
routerProfile.get('/ageGet',ageCat)
routerProfile.get('/getcity',getCity)
routerProfile.get('/getgender',getGender)
routerProfile.get("/community",community)
module.exports = routerProfile