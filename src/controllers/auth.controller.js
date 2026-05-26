const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

async function registerController(req, res) {
  const { email, username, password, bio, profileImage } = req.body;

  // const isUserExistbyEmail = await userModel.findOne({email })

  // if(isUserExistbyEmail){
  //     return res.status(409).json({
  //         message: "User already exists with this email"
  //     })
  // }

  // const isUserExistbyUsername = await userModel.findOne({username })

  // if(isUserExistbyUsername){
  //     return res.status(409).json({
  //         message: "User already exists with this username"
  //     })
  // }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message:
        "User already exists" +
        (isUserAlreadyExists.email === email
          ? " with this email"
          : " with this username"),
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    email,
    username,
    password: hashedPassword,
    bio,
    profileImage,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token)

  res.status(201).json({
    message: "User Registered Successfully",
    user:{
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage
    }
  })
}


async function loginController(req, res) {
  const { email, username, password} = req.body;

  const user = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if(!user){
    return res.status(404).json({
        message: "User not found"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(401).json({
        message:"Invalid Password"
    })
  }

  const token = jwt.sign(
    { id : user._id},
    process.env.JWT_SECRET,
    {
        expiresIn :'7d'
    }
  )

  res.cookie("token", token)

  res.status(200).json({
    message: "User LoggedIn sucessfully",
    user:{
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage
    }
  })

}

module.exports ={
    registerController,
    loginController
}