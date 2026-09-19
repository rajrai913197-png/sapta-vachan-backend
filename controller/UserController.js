const UserModel = require("../model/UserModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const key = process.env.JWT_SECRET;


// ================= CREATE USER =================

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashpass = await bcrypt.hash(password, 10);

    const UserData = await UserModel.create({
      name,
      email,
      password: hashpass,
    });

    res.json(UserData);

  } catch (error) {
    console.log("CREATE USER ERROR:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// ================= LOGIN =================

const userLogin = async (req, res) => {
  try {

    const { email, password } = req.body;

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return res.json("User Not Found");
    }

    const role = findUser.role;

    const comp = await bcrypt.compare(
      password,
      findUser.password
    );

    if (!comp) {
      return res.json("User Not Found");
    }

    const token = jwt.sign(
      {
        userId: findUser._id,
        role: role,
      },
      key
    );

    res.json({
      token: token,
      role: role,
    });

    console.log("LOGIN ROLE:", role);

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


// ================= UPDATE PROFILE =================

const userProfile = async (req, res) => {

  try {

    console.log("PROFILE UPDATE ID:", req.params.id);

    console.log("BODY:", req.body);

    console.log("FILE:", req.file);


    // ================= UPDATE DATA =================

    const updateData = {

      name: req.body.name,

      age: req.body.age,

      gender: req.body.gender,

      city: req.body.city,

      education: req.body.education,

      profession: req.body.profession,

      religion: req.body.religion,

      bio: req.body.bio,

      fatherName: req.body.fatherName,

      motherName: req.body.motherName,

      familyBackground: req.body.familyBackground,

      siblings: req.body.siblings,

      profileComplete: true,

    };


    // ================= IMAGE =================

    if (req.file) {

      console.log("CLOUDINARY IMAGE:", req.file.path);

      updateData.image = req.file.path;

    }


    // ================= DATABASE UPDATE =================

    const createUserData =
      await UserModel.findByIdAndUpdate(

        req.params.id,

        updateData,

        {
          new: true,
        }

      );


    if (!createUserData) {

      return res.status(404).json({
        message: "User not found",
      });

    }


    console.log(
      "PROFILE UPDATED:",
      createUserData
    );


    res.json(createUserData);


  } catch (error) {

    console.log(
      "PROFILE UPDATE ERROR:",
      error
    );

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });

  }

};


// ================= GET ALL USERS =================

const getUserProfile = async (req, res) => {

  try {

    const userProfileData =
      await UserModel.find();

    res.json(userProfileData);

  } catch (error) {

    console.log("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }

};


// ================= GET USER BY ID =================

const getUserProfileDetail = async (req, res) => {

  try {

    const userProfiledetaildata =
      await UserModel.findById(req.params.id);

    res.json(userProfiledetaildata);

  } catch (error) {

    console.log("GET USER ERROR:", error);

    res.status(500).json({
      message: "Internal Server Error",
    });

  }

};


module.exports = {
  createUser,
  userLogin,
  userProfile,
  getUserProfile,
  getUserProfileDetail,
};