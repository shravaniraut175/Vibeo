const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})
const identifyUser = require('../middlewares/auth.middleware');
const likeModel = require("../models/like.model");

const postRouter = express.Router();

postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController);

postRouter.get("/", identifyUser, postController.requestPostController);

postRouter.get("/details/:postId", identifyUser, postController.getPostDetails);

postRouter.post("/like/:postId", identifyUser, postController.likePostController)

module.exports = postRouter;
