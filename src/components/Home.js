import React from "react";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/main", { replace: true });
  };
  return (
    <Grid container direction="column" alignItems="center">
      <h1>THIS IS HOME!</h1>
      <Button onClick={handleClick}>Go to Main Page</Button>
    </Grid>
  );
}
