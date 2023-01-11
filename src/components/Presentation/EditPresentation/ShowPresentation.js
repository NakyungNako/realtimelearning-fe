/* eslint-disable react/no-array-index-key */
import { ArrowBack, ArrowForward, ChatBubble, Send } from "@mui/icons-material";
import {
  Badge,
  Box,
  Checkbox,
  CircularProgress,
  Fab,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
// import randomstring from "randomstring";
import Lottie from "lottie-react";
import animationData from "../../../animation/typing.json";
import { SOCKET_URL } from "../../../config/config";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ScrollableChat from "./Chat/ScrollableChat";

const socket = io.connect(SOCKET_URL);

export default function ShowPresentation() {
  const { selectedSlide, setSelectedSlide, present, setPresent, auth } =
    useAuth();
  const roomCode = present.presentationId;
  const location = useLocation();
  const [index, setIndex] = useState(structuredClone(location.state.index));
  const [viewMessage, setViewMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receive, setReceive] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const messagesEndRef = useRef(null);
  const [question, setQuestion] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   // eslint-disable-next-line object-shorthand
  //   animationData: animationData,
  // };

  //   const roomCode = randomstring.generate({
  //     length: 8,
  //     charset: "numeric",
  //   });

  useEffect(() => {
    socket.emit("join_room", roomCode);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
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
    // socket.on("received_chat", (data) => {
    //   console.log(data.message);
    //   setMessages([...messages, data.message]);
    // });
  }, [selectedSlide]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
    if (!viewMessage && messages.length !== 0 && receive !== "") {
      console.log(messages[messages.length - 1].content, receive);
      setNotification(notification + 0.5);
    }
  }, [messages]);

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
  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await axiosPrivate.post("/api/message/getMessages", {
        chatName: roomCode,
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handlePrevSlide = () => {
    const slides = structuredClone(present.slides);
    const newSlides = slides.map((slide) => {
      if (slide._id === selectedSlide._id) {
        return selectedSlide;
      }
      return slide;
    });
    setPresent((pre) => ({ ...pre, slides: newSlides }));
    setIndex(index - 1);
    setSelectedSlide(slides[index - 1]);
    socket.emit("send_refresh", {
      message: roomCode,
      room: roomCode,
    });
    if (question) setQuestion(false);
  };

  const handleNextSlide = () => {
    if (index + 1 < present.slides.length) {
      const slides = structuredClone(present.slides);
      const newSlides = slides.map((slide) => {
        if (slide._id === selectedSlide._id) {
          return selectedSlide;
        }
        return slide;
      });
      setPresent((pre) => ({ ...pre, slides: newSlides }));
      setIndex(index + 1);
      setSelectedSlide(slides[index + 1]);
      socket.emit("send_refresh", {
        message: roomCode,
        room: roomCode,
      });
    } else {
      setIndex(index + 1);
      setQuestion(true);
      socket.emit("send_refresh", {
        message: questionList,
        room: roomCode,
      });
    }
  };

  const handleOpenMessage = () => {
    setNotification(0);
    setViewMessage(!viewMessage);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", roomCode);
      setNewMessage("");
      const response = await axiosPrivate.post("/api/message", {
        content: newMessage,
        userId: auth.id,
        chatName: roomCode,
      });
      socket.emit("new message", { chat: response.data, room: roomCode });
      setMessages([...messages, response.data]);
    }
  };

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        messages.findIndex((el) => el._id === newMessageRecieved.chat._id) ===
        -1
      ) {
        setReceive(newMessageRecieved.chat.content);
        setMessages([...messages, newMessageRecieved.chat]);
      }
    });
    socket.on("receive_question", (data) => {
      setQuestionList([...questionList, data.question]);
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", roomCode);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 2000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", roomCode);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flex: 1,
          width: "100%",
          height: "90vh",
          alignItems: "center",
        }}
      >
        {index > 0 && (
          <IconButton
            size="large"
            sx={{ boxShadow: 3, m: 2 }}
            onClick={handlePrevSlide}
          >
            <ArrowBack fontSize="inherit" />
          </IconButton>
        )}
      </Box>
      {question ? (
        <Box
          sx={{
            display: "flex",
            flex: 15,
            width: "100%",
            flexDirection: "column",
            paddingLeft: 30,
            justifyContent: "center",
          }}
        >
          <FormGroup>
            {questionList.map((q, i) => (
              <FormControlLabel
                control={<Checkbox size="large" />}
                label={<Typography variant="h3">{q}</Typography>}
                key={i}
                sx={{ fontSize: "100" }}
              />
            ))}
          </FormGroup>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            display: "flex",
            flex: 15,
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
      )}
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flex: 1,
          width: "100%",
          height: "90vh",
          alignItems: "center",
        }}
      >
        {index + 1 <= present.slides.length && (
          <IconButton
            size="large"
            sx={{ boxShadow: 3, m: 2 }}
            onClick={handleNextSlide}
          >
            <ArrowForward fontSize="inherit" />
          </IconButton>
        )}
      </Box>
      {viewMessage && (
        <Box
          sx={{
            bgcolor: "#E8E8E8",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flex: 5,
            width: "100%",
            height: "90vh",
            overflowY: "hidden",
            paddingLeft: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                marginTop: 2,
                marginBottom: 1,
                height: "100%",
                width: "100%",
              }}
            >
              <ScrollableChat messages={messages} />
              <div ref={messagesEndRef} />
            </Box>
          )}

          {isTyping && (
            <Lottie animationData={animationData} style={{ width: 50 }} />
          )}

          <Box
            sx={{
              flexDirection: "row",
              display: "flex",
              alignContent: "center",
              width: "100%",
              marginBottom: 2,
            }}
          >
            <Box sx={{ display: "flex", flex: "5", paddingLeft: 3 }}>
              <TextField
                required
                sx={{ bgcolor: "white" }}
                color="secondary"
                id="outlined-required"
                value={newMessage}
                fullWidth
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
            </Box>
            <Box sx={{ display: "flex", flex: "1" }}>
              <IconButton
                color="primary"
                aria-label="send"
                size="large"
                onClick={sendMessage}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
      <Badge
        badgeContent={notification}
        color="secondary"
        sx={{
          top: "auto",
          left: 80,
          bottom: 95,
          right: "auto",
          position: "fixed",
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          style={{
            margin: 20,
            top: "auto",
            left: 20,
            bottom: 20,
            right: "auto",
            position: "fixed",
          }}
          onClick={handleOpenMessage}
        >
          <ChatBubble />
        </Fab>
      </Badge>
    </Stack>
  );
}
