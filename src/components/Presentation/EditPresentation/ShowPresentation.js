import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
// import randomstring from "randomstring";
import { SOCKET_URL } from "../../../config/config";
import useAuth from "../../../hooks/useAuth";

const socket = io.connect(SOCKET_URL);

export default function ShowPresentation() {
  const { selectedSlide, setSelectedSlide, present } = useAuth();
  const roomCode = present.presentationId;

  //   const roomCode = randomstring.generate({
  //     length: 8,
  //     charset: "numeric",
  //   });

  useEffect(() => {
    socket.emit("join_room", roomCode);
  }, []);

  // const joinRoom = () => {
  //   socket.emit("join_room", "98837483");
  // };

  // const sendData = () => {
  //   socket.emit("send_data", {
  //     slide: selectedSlide,
  //     room: "98837483",
  //   });
  // };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.message === roomCode) {
        socket.emit("send_data", {
          slide: selectedSlide,
          room: roomCode,
        });
      }
    });
  }, [selectedSlide]);

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setSelectedSlide(data.slide);
    });
  }, [socket]);

  //   useEffect(() => {
  //     console.log("joining...");
  //     socket.emit("join_room", roomCode);
  //     socket.emit("send_data", { selectedSlide, roomCode });
  //   }, []);

  //   useEffect(() => {
  //     socket.on("receive_message", (data) => {
  //       setMessageReceived(data.message);
  //     });
  //   }, [socket]);
  // console.log(selectedSlide.answers);
  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginX: 7,
          marginBottom: 3,
          fontWeight: 400,
          wordBreak: "break-word",
        }}
      >
        {selectedSlide?.question}
      </Typography>
      <ResponsiveContainer width="70%" aspect={2}>
        <BarChart data={selectedSlide.answers}>
          <XAxis dataKey="answer" />
          <Tooltip />
          <Bar dataKey="total" fill="#499df2" />
        </BarChart>
      </ResponsiveContainer>
      <Box sx={{ position: "absolute", bottom: 30 }}>
        <Typography variant="h4" sx={{ fontWeight: 300 }}>
          Room Code: {roomCode}
        </Typography>
      </Box>
    </Box>
  );
}
