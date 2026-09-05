const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
   name: {

      type: String,

      required: true

    },

    email: {

      type: String,

      required: true,

      unique: true

    },

    password: {

      type: String,

      required: true

    },

    age: {

      type: Number

    },

    gender: {

      type: String

    },

    city: {

      type: String

    },

    religion: {

      type: String

    },

    education: {

      type: String

    },

    profession: {

      type: String

    },

    bio: {

      type: String

    },

    image: {

      type: String

    },

    fatherName: {

      type: String

    },

    motherName: {

      type: String

    },

    familyBackground: {

      type: String

    },

    siblings: {

      type: Number

    },

    role: {

      type: String,

      enum: ["user", "admin"],

      default: "user"

    },

    profileComplete: {

      type: Boolean,

      default: false

    }

  },

  {
    timestamps: true

})
const UserModel = mongoose.model("User",UserSchema)
module.exports = UserModel