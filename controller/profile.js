 const UserModel = require("../model/UserModel")
 const createProfile =async (req,res)=>{
    const createUserData = await   UserModel.findById(req.params.id)
    res.json(createUserData)
}
const filterUser = async(req,res)=>{
      const filterUserData =await UserModel.find(req.query)
      res.json(filterUserData)
} 
const ageCat = async(req,res)=>{
        const ageData = await  UserModel.distinct("age")
        ageData.sort((a,b)=> a - b)
        res.json(ageData)
}
const getCity = async(req,res)=>{
     const cityData = await   UserModel.distinct("city")
     res.json(cityData)
}
const getGender = async(req,res)=>{
     const genderData = await  UserModel.distinct("gender")
     res.json(genderData)
}
const community = async (req,res)=>{
     const communityData =  await  UserModel.distinct("religion")
     res.json(communityData)
}
module.exports = {createProfile, filterUser,ageCat,getCity,getGender,community}