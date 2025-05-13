const express = require("express");
const upload = require("../middleware/Upload");

const {
    getAllBlogsController,
    createBlogController,
    updateBlogController,
    getBlogByIdController,
    deleteBlogController,
    userBlogControlller,
} = require("../controllers/blogControllers");

//router object
const router = express.Router();

//routes
// GET || all blogs
router.get("/all-blog", getAllBlogsController);

//POST || create blog
router.post("/create-blog", upload.single('image'), createBlogController);

//PUT || update blog
router.put("/update-blog/:id", upload.single('image'), updateBlogController);

//GET || Single Blog Details
router.get("/get-blog/:id", getBlogByIdController);

//DELETE || delete blog
router.delete("/delete-blog/:id", deleteBlogController);

//GET || user blog
router.get("/user-blog/:id", userBlogControlller);

module.exports = router;
