import { Box, Divider, Stack } from "@mui/material";
import useAuth from "../hooks/useAuth";
import Feed from "./Feed/Feed";
import Presentation from "./Presentation/Presentation";
import Sidebar from "./SideBar/SideBar";

export default function Main() {
  const { selectedGroup } = useAuth();
  return (
    <Box>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Divider orientation="vertical" flexItem />
        {selectedGroup && (
          <>
            <Presentation />
            <Divider orientation="vertical" flexItem />
          </>
        )}
        <Feed />
      </Stack>
    </Box>
  );
}
