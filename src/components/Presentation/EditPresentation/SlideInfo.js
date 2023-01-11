import { Add, Clear, DeleteForever, HelpOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function SlideInfo() {
  const { selectedSlide, setSelectedSlide, present, setPresent } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [disableDelete, setDisableDelete] = useState(false);

  useEffect(() => {
    if (present) {
      if (present.slides) {
        present.slides.length < 2
          ? setDisableDelete(true)
          : setDisableDelete(false);
      }
    }
    const timer = setTimeout(async () => {
      const newSlides = present.slides.map((slide) => {
        if (slide._id === selectedSlide._id) return selectedSlide;
        return slide;
      });
      const response = await axiosPrivate.put("/api/present/updateslides", {
        preId: present._id,
        slides: newSlides,
      });
      setPresent(response.data);
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedSlide]);

  const handleCheckBox = (index, checked) => {
    const answerList = selectedSlide.answers;
    const newAnswerList = answerList.map((ans, i) => {
      if (i === index) return { ...ans, correct: checked };
      return ans;
    });
    setSelectedSlide((pre) => ({
      ...pre,
      answers: newAnswerList,
    }));
  };

  const handleQuestionChange = (e) => {
    setSelectedSlide((pre) => ({
      ...pre,
      question: e.target.value,
    }));
  };

  const handleAnswerChange = (index) => (e) => {
    const newArr = [...selectedSlide.answers];
    newArr[index].answer = e.target.value;
    setSelectedSlide((pre) => ({
      ...pre,
      answers: newArr,
    }));
  };

  const handleRemoveAnswer = (index) => {
    const newArr = [...selectedSlide.answers];
    newArr.splice(index, 1);
    setSelectedSlide((pre) => ({
      ...pre,
      answers: newArr,
    }));
  };

  const handleAddNewAnswer = () => {
    const newArr = [...selectedSlide.answers];
    if (newArr.length < 6) {
      newArr.push({
        answer: "",
        correct: false,
        total: 0,
      });
      setSelectedSlide((pre) => ({
        ...pre,
        answers: newArr,
      }));
    }
  };

  const handleDeleteSlide = () => {
    const { slides } = present;
    const index = slides.findIndex((e) => e._id === selectedSlide._id);
    const newSlides = slides.filter((e) => e._id !== selectedSlide._id);
    setPresent((prePre) => ({
      ...prePre,
      slides: newSlides,
    }));

    let newSelectedSlide;
    if (newSlides[index]) {
      newSelectedSlide = newSlides[index];
    } else newSelectedSlide = newSlides[index - 1];

    setSelectedSlide(newSelectedSlide);
  };

  return (
    selectedSlide && (
      <Box flex={2} paddingX={2} paddingTop={4}>
        <Typography variant="h5" sx={{ paddingY: 3 }}>
          Slide Customization
        </Typography>
        <Typography variant="h6">Your Question</Typography>
        <Grid container p={2}>
          <TextField
            id="outlined-size-normal"
            value={selectedSlide.question}
            onChange={handleQuestionChange}
            inputProps={{ maxLength: 50 }}
            fullWidth
          />
        </Grid>
        <Grid container alignItems="center">
          <Typography variant="h6" sx={{ marginRight: 1 }}>
            Answer
          </Typography>
          <Tooltip title="Check the correct choices" arrow>
            <HelpOutline fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid container p={1}>
          {selectedSlide.answers.map((answer, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Grid container alignItems="center" key={index}>
              <Grid item>
                <Checkbox
                  checked={answer.correct}
                  onChange={(e) => handleCheckBox(index, e.target.checked)}
                />
              </Grid>
              <Grid item flex={1}>
                <TextField
                  size="small"
                  value={answer.answer}
                  onChange={handleAnswerChange(index)}
                  margin="dense"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleRemoveAnswer(index)}>
                  <Clear />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid container justifyContent="center" paddingY={1}>
            <Button
              variant="contained"
              startIcon={<Add />}
              color="info"
              sx={{ width: "100%" }}
              onClick={handleAddNewAnswer}
            >
              Add Answer
            </Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" p={2}>
          <Button
            variant="contained"
            color="error"
            disabled={disableDelete}
            endIcon={<DeleteForever />}
            onClick={handleDeleteSlide}
          >
            Delete Slide
          </Button>
        </Grid>
      </Box>
    )
  );
}
