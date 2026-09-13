const UserModel =require("../model/UserModel")
const getAllUsers = async(req,res)=>{
       const userdata = await UserModel.find()
       res.json(userdata)
}
const deleteUser = async (req,res)=>{
    const dltUser =   await  UserModel.findByIdAndDelete(req.params.id)
    res.json(dltUser)
}
module.exports = {getAllUsers,deleteUser}