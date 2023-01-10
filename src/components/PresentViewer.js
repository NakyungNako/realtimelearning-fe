import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import randomstring from "randomstring";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
import { SOCKET_URL } from "../config/config";

const socket = io.connect(SOCKET_URL);

export default function PresentViewer() {
  const location = useLocation();
  const [isSubmit, setIsSubmit] = useState(false);
  const [slideData, setSlideData] = useState();
  const [ansValue, setAnsValue] = useState("");
  const valueCode = location.state?.valueCode;

  useEffect(() => {
    socket.emit("join_room", valueCode);
    socket.emit("send_message", { message: valueCode, room: valueCode });
  }, []);

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setSlideData(data.slide);
    });
    socket.on("receive_message", (data) => {
      if (data.message === valueCode) {
        setIsSubmit(false);
        socket.emit("send_message", { message: valueCode, room: valueCode });
      }
    });
  }, [socket]);

  const ansChange = (event) => {
    setAnsValue(event.target.value);
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

  return (
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
