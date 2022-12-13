import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import randomstring from "randomstring";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
import { SOCKET_URL } from "../config/config";

const socket = io.connect(SOCKET_URL);

export default function JoinRoom() {
  const [isJoin, setIsJoin] = useState(false);
  const [slideData, setSlideData] = useState();
  //   const [value, setValue] = useState("");
  const [valueCode, setValueCode] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
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

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setSlideData(data.slide);
    });
  }, [socket]);

  //   useEffect(() => {
  //     socket.on("receive_data", (data) => {
  //       setSlideData(data.selectedSlide);
  //     });
  //   }, [socket]);
  // console.log(slideData);

  const handleChange = (e) => {
    setValueCode(e.target.value);
  };

  const handleClick = () => {
    socket.emit("join_room", valueCode);
    socket.emit("send_message", { message: valueCode, room: valueCode });
    setIsJoin(true);
  };

  const [open, setOpen] = useState(false);
  const [ansValue, setAnsValue] = useState("");

  const ansChange = (event) => {
    setAnsValue(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = () => {
    const tempSlide = slideData;
    const slideAnswers = slideData.answers.map((an) => {
      if (an.answer === ansValue) {
        return {
          ...an,
          total: an.total + 1,
        };
      }
      return an;
    });
    tempSlide.answers = slideAnswers;
    socket.emit("send_data", {
      slide: tempSlide,
      room: valueCode,
    });
    setIsSubmit(true);
    setSlideData((oldSlide) => ({
      ...oldSlide,
      answers: slideAnswers,
    }));
  };

  //   useEffect(() => {
  //     if (slideData && valueCode) {
  //       socket.emit("send_data", {
  //         slide: slideData,
  //         room: valueCode,
  //       });
  //     }
  //   }, [setSlideData]);

  return !isJoin ? (
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
        message="Wrong Code, please try again"
      />
    </Grid>
  ) : (
    slideData && (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "90vh" }}
      >
        {isSubmit && (
          <ResponsiveContainer width="50%" aspect={3}>
            <BarChart data={slideData.answers}>
              <XAxis dataKey="answer" />
              <Tooltip />
              <Bar dataKey="total" fill="#499df2" />
            </BarChart>
          </ResponsiveContainer>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h2"
            sx={{
              marginX: 7,
              marginBottom: 3,
              fontWeight: 400,
              wordBreak: "break-word",
            }}
          >
            {slideData.question}
          </Typography>
        </Box>
        <Box sx={{ width: "20%", display: "flex", flexDirection: "column" }}>
          <FormControl>
            <RadioGroup value={ansValue} onChange={ansChange}>
              {slideData.answers.map((ans) => (
                <FormControlLabel
                  disabled={isSubmit}
                  value={ans.answer}
                  control={<Radio />}
                  label={ans.answer}
                  key={randomstring.generate(7)}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "center", m: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Grid>
    )
  );
}
