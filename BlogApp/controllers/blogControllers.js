const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

// GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate("user");
        if (!blogs || blogs.length === 0) {
            return res.status(200).send({
                success: false,
                message: "No Blogs Found",
            });
        }
        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            message: "All Blogs list",
            blogs,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting blogs",
            error,
        });
    }
};

// CREATE BLOG
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, user } = req.body;
        const imagePath = req.file ? req.file.path : null; // Image is optional now

        // Validation
        if (!title || !description || !user) {  // No validation for image
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const existingUser = await userModel.findById(user);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "Unable to find user",
            });
        }

        const newBlog = new blogModel({
            title,
            description,
            image: imagePath, // Set image as null if not provided
            user
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog);
        await existingUser.save({ session });
        await session.commitTransaction();

        return res.status(201).send({
            success: true,
            message: "Blog created!",
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while creating blog",
            error,
        });
    }
};



// UPDATE BLOG
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const imagePath = req.file ? req.file.path : null;  // Image is optional now

        // Find existing blog
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found",
            });
        }

        // Update fields
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.image = imagePath || blog.image;  // Keep existing image if not updated

        await blog.save();

        return res.status(200).send({
            success: true,
            message: "Blog updated!",
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while updating blog",
            error,
        });
    }
};

// SINGLE BLOG
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found with this ID",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Fetch single blog",
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while getting single blog",
            error,
        });
    }
};

// DELETE BLOG
exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel
            .findByIdAndDelete(req.params.id)
            .populate("user");
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found",
            });
        }
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success: true,
            message: "Blog deleted!",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error while deleting blog",
            error,
        });
    }
};

// GET USER BLOG
exports.userBlogControlller = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs");

        if (!userBlog) {
            return res.status(404).send({
                success: false,
                message: "Blogs not found with this user ID",
            });
        }
        return res.status(200).send({
            success: true,
            message: "User blogs fetched",
            userBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error in user blog",
            error,
        });
    }
};
