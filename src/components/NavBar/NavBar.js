import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to={"/"} style={{ textDecoration: "none", color: "white" }}>
              Registration
            </Link>
          </Typography>
          <Link
            to={"/login"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button color="inherit">Login</Button>
          </Link>
          <Link
            to={"/signup"}
            style={{ textDecoration: "none", color: "white" }}
          >
            <Button color="inherit">Signup</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
