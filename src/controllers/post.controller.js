const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {



  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "test",
    folder: "vibeo"
  });
  // res.send(file);

  const post = await postModel.create({
    caption: req.body.caption,
    image: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Received Successfully",
    post,
  });
}

async function requestPostController(req, res) {
  

  const userId = req.user.id

  const post = await postModel.find({
    user: userId
  });
  
  res.status(200).json({
    message: "Post fetched",
    post
  })
}

async function getPostDetails(req, res){
  

  const userId = req.user.id
  const postId = req.params.postId
  
  const post = await postModel.findById(postId)

  if(!post){
    return res.status(404).json({
      message: "Post Not Found"
    })
  }


  const isValidUser = post.user.toString() === userId

  if(!isValidUser){
    return res.status(404).json({
      message:"Forbidden Content"
    })
  }

  return res.status(200).json({
    message: "Post fetched successfully",
    post
  })
}

module.exports = {
  createPostController,
  requestPostController,
  getPostDetails
};
