import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";
import "../assets/styles/pages/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/v1/user/login", {
                email: inputs.email,
                password: inputs.password,
            });
            if (data.success) {
                localStorage.setItem("userId", data?.user._id);
                dispatch(authActions.login());
                toast.success("User login Successfully");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <Box
                className="login-container"
                maxWidth={450}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                margin="auto"
                marginTop={5}
                boxShadow="10px 10px 20px #ccc"
                padding={3}
                borderRadius={5}
            >
                <Typography
                    variant="h4"
                    className="login-title"
                    sx={{ textTransform: "uppercase" }}
                    padding={3}
                    textAlign="center"
                >
                    Login
                </Typography>

                <TextField
                    placeholder="Email"
                    value={inputs.email}
                    name="email"
                    margin="normal"
                    type="email"
                    required
                    onChange={handleChange}
                    className="login-input"
                />
                <TextField
                    placeholder="Password"
                    value={inputs.password}
                    name="password"
                    margin="normal"
                    type="password"
                    required
                    onChange={handleChange}
                    className="login-input"
                />

                <Button
                    type="submit"
                    className="login-submit-button"
                    sx={{ borderRadius: 3, marginTop: 3 }}
                    variant="contained"
                    color="primary"
                >
                    Submit
                </Button>
                <Button
                    onClick={() => navigate("/register")}
                    className="login-register-button"
                    sx={{ borderRadius: 3, marginTop: 3 }}
                >
                    Not a user? Please Register
                </Button>
            </Box>
        </form>
    );
};

export default Login;
