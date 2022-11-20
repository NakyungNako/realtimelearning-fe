import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import React from "react";

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
        </Toolbar>
      </AppBar>
    </Box>
  );
}
