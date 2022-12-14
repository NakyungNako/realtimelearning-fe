import { Box } from "@mui/material";
import PresentationList from "./PresentationList";

export default function Presentation() {
  return (
    <Box display="flex" flex={3} paddingTop={10}>
      <PresentationList />
    </Box>
  );
}
