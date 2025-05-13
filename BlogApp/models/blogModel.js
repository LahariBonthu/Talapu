const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],  // 'required' instead of 'require'
        },
        description: {
            type: String,
            required: [true, "Description is required"], // Fixed typo 'require' to 'required'
        },
        image: {
            type: String,
            required: [false, "image is not compulsory"], // Make it optional, will store image path here
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "User id is required"], // Fixed typo 'require' to 'required'
        },
    },
    { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
