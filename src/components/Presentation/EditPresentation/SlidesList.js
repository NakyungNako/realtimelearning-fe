import { AddBoxOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
// import { cloneElement } from "react";
import SlidePreview from "./SlidePreview.js/SlidePreview";

// function generate(element) {
//   return [0, 1, 2].map((value) =>
//     cloneElement(element, {
//       key: value,
//     })
//   );
// }

export default function SlidesList() {
  const { present, setPresent, selectedSlide, setSelectedSlide } = useAuth();
  const slides = present?.slides;
  const axiosPrivate = useAxiosPrivate();

  const handleSelectedSlide = (slide) => {
    setSelectedSlide(slide);
  };

  const handleAddNewSlide = async () => {
    const response = await axiosPrivate.put("/api/present/addslide", {
      id: present._id,
    });
    if (response.data) setPresent(response.data);
  };

  useEffect(() => {
    if (slides) {
      if (!selectedSlide) {
        setSelectedSlide(slides[0]);
      }
    }
  }, [present]);

  return (
    <Box flex={1} style={{ minHeight: "85vh" }}>
      <Grid container paddingTop={6} paddingBottom={2}>
        <List>
          {slides?.map((slide, index) => (
            <ListItemButton
              key={slide._id}
              onClick={() => handleSelectedSlide(slide)}
              sx={
                selectedSlide?._id === slide._id
                  ? {
                      bgcolor: "#5FB0F0",
                      transition: "0.5s",
                      "&:hover": {
                        bgcolor: "#2196f3",
                        opacity: 0.7,
                      },
                    }
                  : {
                      bgcolor: "white",
                      transition: "0.5s",
                      "&:hover": {
                        bgcolor: "#EFEFEF",
                        opacity: 0.7,
                      },
                    }
              }
            >
              <ListItemText primary={`${index + 1}.`} sx={{ marginRight: 4 }} />
              <SlidePreview title={slide.question} />
            </ListItemButton>
          ))}
        </List>
      </Grid>
      <Grid container justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<AddBoxOutlined />}
          onClick={handleAddNewSlide}
        >
          Add Slide
        </Button>
      </Grid>
    </Box>
  );
}
