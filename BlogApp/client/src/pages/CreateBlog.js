import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    TextField,
    Typography,
    InputLabel,
    CircularProgress
} from "@mui/material";
import toast from "react-hot-toast";
import "../assets/styles/pages/Createblog.css";

const CreateBlog = () => {
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match("image.*")) {
                toast.error("Please select an image file (JPEG, PNG, etc.)");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.title.trim()) return toast.error("Title cannot be empty");
        if (!inputs.description.trim()) return toast.error("Description cannot be empty");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", inputs.title);
            formData.append("description", inputs.description);
            formData.append("user", localStorage.getItem("userId"));
            if (image) formData.append("image", image);

            const { data } = await axios.post("/api/v1/blog/create-blog", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data?.success) {
                toast.success("Blog Created Successfully!");
                navigate("/my-blogs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create blog");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            className="create-blog-form"
        >
            <Typography variant="h2" className="create-blog-title">
                Create A Post
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

            <InputLabel className="create-blog-label">Upload Image </InputLabel>
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
                    Select Image
                </Button>

                {previewUrl && (
                    <>
                        <Typography className="create-blog-preview-text">Image Preview:</Typography>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="create-blog-preview-image"
                            onClick={() => fileInputRef.current.click()}
                        />
                    </>
                )}
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="plum"
                className="create-blog-submit-btn"
                disabled={loading || !inputs.title || !inputs.description}
                fullWidth
            >
                {loading ? <CircularProgress size={24} /> : "CREATE"}
            </Button>
        </Box>
    );
};

export default CreateBlog;
