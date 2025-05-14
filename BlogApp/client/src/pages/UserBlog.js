import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import "../assets/styles/pages/UserBlog.css";

const UserBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user blogs with proper error handling
    const getUserBlogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const id = localStorage.getItem("userId");
            if (!id) {
                throw new Error("User ID not found in localStorage");
            }

            const { data } = await axios.get(`/api/v1/blog/user-blog/${id}`);

            if (data?.success) {
                // Transform the data to ensure consistent structure
                const formattedBlogs = (data.userBlog?.blogs || []).map(blog => ({
                    ...blog,
                    // Ensure user object exists with username
                    user: {
                        ...blog.user,
                        username: blog.user?.username || data.userBlog?.username || "You"
                    }
                }));
                setBlogs(formattedBlogs);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setError("Failed to load blogs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserBlogs();
    }, []);

    if (loading) {
        return <div className="loading-spinner">Loading your blogs...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-blogs-container">
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <BlogCard
                        key={blog._id}  // Important for React's reconciliation
                        id={blog._id}
                        isUser={true}
                        title={blog.title}
                        description={blog.description}
                        image={blog.image}
                        username={blog.user.username}
                        time={blog.createdAt}
                    />
                ))
            ) : (
                <div className="center-page">
                    <h1 className="no-blogs-message">You haven’t created any blogs yet.</h1>
                </div>

            )}
        </div>
    );
};

export default UserBlog;

