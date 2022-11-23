import {
  AppBar, Box, Toolbar, Typography, Button,
} from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";

export default function LoggedNavBar() {
  const navigate = useNavigate();
  const logout = useLogout();

  const logOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
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
    </Box>
  );
}
