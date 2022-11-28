import { Box, Divider, Stack } from "@mui/material";
import Feed from "./Feed/Feed";
import Sidebar from "./SideBar/SideBar";

export default function Main() {
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Divider orientation="vertical" flexItem />
        <Feed />
      </Stack>
    </Box>
  );
}
