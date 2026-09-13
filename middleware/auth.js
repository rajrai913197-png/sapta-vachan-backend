const jwt = require("jsonwebtoken")
const auth = (req,res,next)=>{
   const token =  req.headers.authorization
   console.log(token)
 jwt.verify(token,"hello")
    next()
}
module.exports = auth