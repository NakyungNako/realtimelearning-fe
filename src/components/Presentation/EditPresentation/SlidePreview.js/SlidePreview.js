import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function SlidePreview({ title }) {
  return (
    <Box
      sx={{
        width: 130,
        height: 80,
        backgroundColor: "#D7D7D7",
        // "&:hover": {
        //   backgroundColor: "grey",
        //   opacity: [0.9, 0.8, 0.7],
        // },
        p: 2,
      }}
    >
      <Typography noWrap sx={{ fontSize: 15, fontWeight: 500 }}>
        {title}
      </Typography>
    </Box>
  );
}

SlidePreview.propTypes = {
  title: PropTypes.string.isRequired,
};
