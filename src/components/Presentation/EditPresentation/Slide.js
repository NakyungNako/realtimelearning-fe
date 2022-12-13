import { Box, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";

export default function Slide() {
  const { selectedSlide } = useAuth();
  return (
    <Box
      flex={4}
      sx={{
        backgroundColor: "#D7D7D7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        p: 10,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Typography
          variant="h3"
          sx={{ m: 5, fontWeight: 500, wordBreak: "break-word" }}
        >
          {selectedSlide?.question}
        </Typography>
      </Box>
    </Box>
  );
}
