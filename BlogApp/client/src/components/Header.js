import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/components/Header.css";

import {
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";

const Header = () => {
  let isLogin = useSelector((state) => state.isLogin);
  isLogin = isLogin || localStorage.getItem("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const handleLogout = () => {
    try {
      dispatch(authActions.logout());
      toast.success("Logout Successfully");
      navigate("/login");
      localStorage.clear();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar position="sticky" className="custom-appbar">
        <Toolbar className="custom-toolbar">
          <Typography variant="h4" className="custom-title">
            Talapu...
          </Typography>

          {isLogin && (
            <Box display="flex" marginLeft="auto" marginRight="auto">
              <Tabs
                textColor="inherit"
                value={value}
                onChange={(e, val) => setValue(val)}
                className="custom-tabs"
              >
                <Tab
                  className="custom-tab"
                  label="Blogs"
                  LinkComponent={Link}
                  to="/blogs"
                />
                <Tab
                  className="custom-tab"
                  label="My Blogs"
                  LinkComponent={Link}
                  to="/my-blogs"
                />
                <Tab
                  className="custom-tab"
                  label="Create Blog"
                  LinkComponent={Link}
                  to="/create-blog"
                />
              </Tabs>
            </Box>
          )}

          <Box display="flex" marginLeft="auto" className="custom-button-group">
            {!isLogin ? (
              <>
                <Button
                  className="custom-button"
                  sx={{ margin: 1 }}
                  LinkComponent={Link}
                  to="/login"
                >
                  Login
                </Button>
                <Button
                  className="custom-button"
                  sx={{ margin: 1 }}
                  LinkComponent={Link}
                  to="/register"
                >
                  Register
                </Button>
                <Button
                  className="custom-button"
                  sx={{ margin: 1 }}
                  LinkComponent={Link}
                  to="/about"
                >
                  About
                </Button>
              </>
            ) : (
              <Button
                className="custom-button logout-button"
                sx={{ margin: 1 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
