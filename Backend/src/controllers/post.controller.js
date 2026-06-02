const postModel = require("../models/post.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");

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

async function likePostController(req, res){
  const username = req.user.username;
  const postId = req.params.postId
  
  const post = await postModel.findById(postId);

  if(!post){
    return res.status(400).json({
      message:`Post not found`
    })
  }

  const like = await likeModel.create({
    post: postId,
    user: username
  })

  res.status(200).json({
    message: `Liked the post ${post.caption}`
  })
}

module.exports = {
  createPostController,
  requestPostController,
  getPostDetails,
  likePostController
};
