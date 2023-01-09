import { PlayArrow, Save } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function EditHeader() {
  const { present, setPresent, setSelectedSlide, selectedSlide } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

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

  const handleViewPresent = () => {
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
            sx={{ width: 500 }}
            inputProps={{ style: { fontWeight: "bold", fontSize: 20 } }}
          />
        )}
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
