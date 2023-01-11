import { PlayArrow, Save } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function EditHeader() {
  const { present, setPresent, setSelectedSlide, selectedSlide, auth } =
    useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [value, setValue] = useState("public");

  const handleChange = (event) => {
    if (event.target.value === "public") {
      setPresent((pre) => ({
        ...pre,
        isPrivate: false,
      }));
    }
    if (event.target.value === "private") {
      setPresent((pre) => ({
        ...pre,
        isPrivate: true,
      }));
    }
    setValue(event.target.value);
  };

  const handleTitleChange = (e) => {
    setPresent((pre) => ({
      ...pre,
      title: e.target.value,
    }));
    if (e.target.value === "") {
      setPresent((pre) => ({
        ...pre,
        title: " ",
      }));
    }
  };

  const handleSavePre = async () => {
    const response = await axiosPrivate.put("/api/present/updatepresent", {
      preId: present._id,
      present,
    });
    console.log(response.data);
    setPresent();
    setSelectedSlide();
    navigate("/", { replace: true });
  };

  const handleViewPresent = async () => {
    // socket.emit("send_message", { message: "hello" });
    const index = present.slides.findIndex(
      (el) => el._id === selectedSlide._id
    );
    const slideAnswers = selectedSlide.answers.map((an) => ({
      ...an,
      total: 0,
    }));
    setSelectedSlide((oldSlide) => ({
      ...oldSlide,
      answers: slideAnswers,
    }));
    const response = await axiosPrivate.post("/api/chat", {
      userId: auth.id,
      chatName: present.presentationId,
    });
    console.log(response);
    navigate(`/slideshow/${selectedSlide._id}`, {
      replace: true,
      state: { index },
    });
  };

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      paddingY={2}
      paddingX={2}
    >
      <Grid item>
        {present?.title && (
          <TextField
            id="outlined-size-normal"
            defaultValue={present.title}
            onChange={handleTitleChange}
            sx={{ width: 500, mr: 5 }}
            inputProps={{ style: { fontWeight: "bold", fontSize: 20 } }}
          />
        )}
        <FormControl sx={{ mt: 1 }}>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            row
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Save />}
          sx={{ marginRight: 2 }}
          onClick={handleSavePre}
        >
          Save
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleViewPresent}
          endIcon={<PlayArrow />}
        >
          Present
        </Button>
      </Grid>
    </Grid>
  );
}
