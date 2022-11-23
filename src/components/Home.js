import React from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/users", { replace: true });
  };
  return (
    <Grid container direction="column" alignItems="center">
      <h2>THIS IS HOME!</h2>
      <Button onClick={handleClick}>Users List</Button>
    </Grid>
  );
}
