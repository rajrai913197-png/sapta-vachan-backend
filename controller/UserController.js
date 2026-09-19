
const UserModel = require("../model/UserModel")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const key = process.env.JWT_SECRET
const createUser = async(req,res)=>{
    const {name,email,password} = req.body
    const hashpass = await bcrypt.hash(password,10)
    const UserData = await UserModel.create({name , email,password:hashpass})
    res.json(UserData)
}
const userLogin = async(req,res) =>{
    const {email,password} = req.body
       const findUser = await UserModel.findOne({email})
       role = findUser.role
      const comp = await bcrypt.compare(password,findUser.password)
      if(!comp){
         res.json("User Not Found")
      } else{
        const token =   jwt.sign({
            userId : findUser._id,
            role : role
           
           },key)
           res.json({token : token,role : role})
           console.log(role)
      }
}

const userProfile = async (req, res) => {
  const createUserData = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,

      age: req.body.age,

      gender: req.body.gender,

      city: req.body.city,

      education: req.body.education,

      profession: req.body.profession,

      religion: req.body.religion,

      bio: req.body.bio,

      image: req.file.path,

      fatherName: req.body.fatherName,

      motherName: req.body.motherName,

      familyBackground: req.body.familyBackground,

      siblings: req.body.siblings,

      profileComplete: true
    },
    { returnDocument : true}
  );

  res.json(createUserData);
};

const getUserProfile = async(req,res)=>{
   const userProfileData = await  UserModel.find()
   res.json(userProfileData)
}
const getUserProfileDetail =async (req,res)=>{
   const  userProfiledetaildata =  await UserModel.findById(req.params.id)
   res.json(userProfiledetaildata)
}
module.exports = {createUser,userLogin,userProfile,getUserProfile,getUserProfileDetail} 