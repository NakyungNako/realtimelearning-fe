import { ArrowBack } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";

export default function LoggedNavBar() {
  const { present } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSlideShow, setIsSlideShow] = useState(false);
  const logout = useLogout();
  const path = location.pathname;

  useEffect(() => {
    if (path.includes("slideshow")) setIsSlideShow(true);
    else setIsSlideShow(false);
  }, [path]);

  const logOut = async () => {
    await logout();
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate(`/edit/${present._id}`, { replace: true });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {!isSlideShow ? (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                Registration
              </Link>
            </Typography>
            <Button color="inherit" onClick={logOut}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <AppBar
          elevation={0}
          position="static"
          sx={{ background: "white", color: "black" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              sx={{ boxShadow: 3, m: 2 }}
              onClick={handleGoBack}
            >
              <ArrowBack fontSize="inherit" />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
    </Box>
  );
}
