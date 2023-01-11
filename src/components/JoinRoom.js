import { Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function JoinRoom() {
  //   const [value, setValue] = useState("");
  const [valueCode, setValueCode] = useState("");

  const [open, setOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();
  //   const [message, setMessage] = useState("");
  //   const roomCode = location.state;

  //   useEffect(() => {
  //     console.log("joining...");
  //     socket.emit("join_room", roomCode);
  //   }, []);

  //   useEffect(() => {
  //     socket.on("receive_data", (data) => {
  //       console.log(data);
  //       setSlideData(data);
  //     });
  //   }, [socket]);

  //   console.log(roomCode, slideData);

  //   const joinRoom = () => {
  //     socket.emit("join_room", "98837483");
  //   };

  //   const sendMessage = () => {
  //     socket.emit("send_message", { message: value, room: "98837483" });
  //   };

  //   useEffect(() => {
  //     socket.on("receive_data", (data) => {
  //       setSlideData(data.selectedSlide);
  //     });
  //   }, [socket]);
  // console.log(slideData);

  const handleChange = (e) => {
    setValueCode(e.target.value);
  };

  const handleClick = async () => {
    // socket.emit("join_room", valueCode);
    // socket.emit("send_message", { message: valueCode, room: valueCode });
    const response = await axiosPrivate.post("/api/group/privateCheck", {
      email: auth.email,
      presentCode: valueCode,
    });
    console.log(response.data.message);
    if (response.data.message === true || response.data.message === "public") {
      navigate("/presentViewer", { state: { valueCode } });
    } else {
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //   useEffect(() => {
  //     if (slideData && valueCode) {
  //       socket.emit("send_data", {
  //         slide: slideData,
  //         room: valueCode,
  //       });
  //     }
  //   }, [setSlideData]);
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
      <TextField margin="normal" value={valueCode} onChange={handleChange} />
      <Button variant="outline" onClick={handleClick}>
        Join Room
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="You do not have permission to join this room"
      />
    </Grid>
  );
}
