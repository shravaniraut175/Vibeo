const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        default: ""
    },
    image: {
        type: String,
        required: [true, "Image URL is required"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required"]
    }
})

const postModel = mongoose.model("post", postSchema)

module.exports = postModel