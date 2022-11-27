import { Box, Divider } from "@mui/material";
import GroupList from "./GroupList";
import UserInfo from "./UserInfo";

export default function Sidebar() {
  return (
    <Box flex={2}>
      <UserInfo />
      <Divider />
      <GroupList />
    </Box>
  );
}
