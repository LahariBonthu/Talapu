import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import "../assets/styles/pages/Createblog.css";

const BlogDetails = () => {
    const [blog, setBlog] = useState(null);
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Get blog details
    const getBlogDetail = async () => {
        try {
            const { data } = await axios.get(`/api/v1/blog/get-blog/${id}`);
            if (data?.success) {
                setBlog(data.blog);
                setInputs({
                    title: data.blog.title,
                    description: data.blog.description,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch blog details");
        }
    };

    useEffect(() => {
        getBlogDetail();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputs.title.trim() || !inputs.description.trim()) {
            toast.error("Title and description cannot be empty");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", inputs.title);
            formData.append("description", inputs.description);
            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.put(
                `/api/v1/blog/update-blog/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (data?.success) {
                toast.success("Blog updated successfully!");
                navigate("/my-blogs");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update blog");
        } finally {
            setLoading(false);
        }
    };

    if (!blog) return <Typography>Loading...</Typography>;

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            className="create-blog-form"
        >
            <Typography variant="h2" className="create-blog-title">
                Update Post
            </Typography>

            <InputLabel className="create-blog-label">Title</InputLabel>
            <TextField
                name="title"
                value={inputs.title}
                onChange={handleChange}
                className="create-blog-input"
                required
                fullWidth
            />

            <InputLabel className="create-blog-label">Description</InputLabel>
            <TextField
                name="description"
                value={inputs.description}
                onChange={handleChange}
                className="create-blog-input"
                required
                multiline
                rows={4}
                fullWidth
            />

            <InputLabel className="create-blog-label">Update Image (Optional)</InputLabel>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
            />

            <Box className="create-blog-image-container">
                <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current.click()}
                    className="create-blog-image-button"
                >
                    {previewUrl ? "Change Image" : "Select New Image"}
                </Button>

                {previewUrl ? (
                    <>
                        <Typography className="create-blog-preview-text">New Image Preview:</Typography>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="create-blog-preview-image"
                            onClick={() => fileInputRef.current.click()}
                        />
                    </>
                ) : blog.image && (
                    <>
                        <Typography className="create-blog-preview-text">Current Image:</Typography>
                        <img
                            src={`/${blog.image}`}
                            alt="Current"
                            className="create-blog-preview-image"
                            onClick={() => fileInputRef.current.click()}
                        />
                    </>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                className="create-blog-submit-btn"
                disabled={loading || !inputs.title || !inputs.description}
                fullWidth
            >
                {loading ? "Updating..." : "Update Post"}
            </Button>
        </Box>
    );

};

export default BlogDetails;