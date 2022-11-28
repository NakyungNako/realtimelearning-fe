import { Box, Divider, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import FeedHeader from "./FeedHeader";
import FeedInfo from "./FeedInfo";

export default function Feed() {
  const { selectedGroup } = useAuth();
  return selectedGroup ? (
    <Box flex={4} style={{ minHeight: "90vh" }}>
      <FeedHeader />
      <Divider />
      <FeedInfo />
    </Box>
  ) : (
    <Box
      display="flex"
      flex={4}
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
    >
      <Typography variant="h5">PLEASE CHOOSE A GROUP!</Typography>
    </Box>
  );
}
