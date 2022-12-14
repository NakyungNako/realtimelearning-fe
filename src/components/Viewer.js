import { Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";
// import { SOCKET_URL } from "../config/config";

// const socket = io.connect(SOCKET_URL);

export default function Viewer() {
  const [value, setValue] = useState("");
  //   const [correctCode, setCorrectCode] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //   useEffect(() => {
  //     socket.on("receive_room", (data) => {
  //       setCorrectCode(data);
  //     });
  //   }, [socket]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    if (value !== "") {
      if (value.length === 8) {
        navigate("/roomjoining", { replace: true, state: value });
      } else setOpen(true);
    }
  };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "90vh" }}
    >
      <Typography variant="h5">Enter Code:</Typography>
      <TextField margin="normal" value={value} onChange={handleChange} />
      <Button variant="outline" onClick={handleClick}>
        Join Room
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Wrong Code, please try again"
      />
    </Grid>
  );
}
