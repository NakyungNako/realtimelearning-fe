import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  // Radio,
  // RadioGroup,
  Typography,
} from "@mui/material";
import randomstring from "randomstring";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
import { ChatBubble, Send } from "@mui/icons-material";
import Lottie from "lottie-react";
import animationData from "../animation/typing.json";
import { SOCKET_URL } from "../config/config";
import ScrollableChat from "./Presentation/EditPresentation/Chat/ScrollableChat";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const socket = io.connect(SOCKET_URL);

export default function PresentViewer() {
  const location = useLocation();
  const { auth } = useAuth();
  const [viewMessage, setViewMessage] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [slideData, setSlideData] = useState();
  const [isChecked, setIsChecked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receive, setReceive] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState(0);
  const [question, setQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const messagesEndRef = useRef(null);
  // const [ansValue, setAnsValue] = useState("");
  const valueCode = location.state?.valueCode;
  let isSent = false;

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await axiosPrivate.post("/api/message/getMessages", {
        chatName: valueCode,
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    socket.emit("join_room", valueCode);
    socket.emit("send_message", { message: valueCode, room: valueCode });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
    if (!viewMessage && messages.length !== 0 && receive !== "") {
      console.log(messages[messages.length - 1].content, receive);
      setNotification(notification + 0.5);
    }
  }, [messages]);
  // useEffect(() => {
  //   socket.on("receive_data", (data) => {
  //     setSlideData(data.slide);
  //     if (!isSent) {
  //       setIsChecked(data.slide.answers.slice().fill(false));
  //       isSent = true;
  //       console.log(data.slide.answers);
  //     }
  //   });
  // }, [isSent]);
  useEffect(() => {
    if (!isSent && slideData != null) {
      setIsChecked(slideData.answers.slice().fill(false));
      isSent = true;
    }
  }, [slideData]);

  useEffect(() => {
    socket.on("receive_data", (data) => {
      setSlideData(data.slide);
    });
    socket.on("receive_refresh", (data) => {
      if (data.message === valueCode) {
        setIsSubmit(false);
        isSent = false;
        socket.emit("send_message", { message: valueCode, room: valueCode });
        if (question) setQuestion(false);
      } else {
        setIsSubmit(false);
        setQuestion(true);
      }
    });
  }, [socket]);

  // const ansChange = (event) => {
  //   setAnsValue(event.target.value);
  // };

  const handleSubmit = () => {
    const tempSlide = slideData;
    const slideAnswers = slideData.answers.map((an, index) => {
      if (isChecked[index] === true) {
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

  const toggleCheckboxValue = (index) => {
    setIsChecked(isChecked.map((v, i) => (i === index ? !v : v)));
  };

  const handleOpenMessage = () => {
    setNotification(0);
    setViewMessage(!viewMessage);
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", valueCode);
      setNewMessage("");
      const response = await axiosPrivate.post("/api/message", {
        content: newMessage,
        userId: auth.id,
        chatName: valueCode,
      });
      socket.emit("new message", { chat: response.data, room: valueCode });
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
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", valueCode);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 2000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", valueCode);
        setTyping(false);
      }
    }, timerLength);
  };

  const questionHandler = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleQuestion = () => {
    socket.emit("send_question", { question: newQuestion, room: valueCode });
  };

  return (
    slideData && (
      <Box sx={{ display: "flex", direction: "row" }}>
        <Box
          sx={{
            flex: "5",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginY: 20,
          }}
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
          {question ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                id="outlined-basic"
                sx={{ padding: 2 }}
                value={newQuestion}
                onChange={questionHandler}
              />
              <Button variant="outlined" onClick={handleQuestion}>
                Add Question
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: "20%", flexDirection: "column" }}>
              <FormControl>
                {/* <RadioGroup value={ansValue} onChange={ansChange}>
              {slideData.answers.map((ans) => (
                <FormControlLabel
                  disabled={isSubmit}
                  value={ans.answer}
                  control={<Radio />}
                  label={ans.answer}
                  key={randomstring.generate(7)}
                />
              ))}
            </RadioGroup> */}
                <FormGroup>
                  {slideData.answers.map((ans, index) => (
                    <FormControlLabel
                      disabled={isSubmit}
                      value={ans.answer}
                      control={
                        <Checkbox
                          checked={isChecked[index]}
                          onClick={() => toggleCheckboxValue(index)}
                          name="gilad"
                        />
                      }
                      label={ans.answer}
                      key={randomstring.generate(7)}
                    />
                  ))}
                </FormGroup>
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
          )}
        </Box>

        {viewMessage && (
          <Box
            sx={{
              bgcolor: "#E8E8E8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              flex: "2",
              width: "100%",
              height: "92vh",
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
            left: 100,
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
      </Box>
    )
  );
}
