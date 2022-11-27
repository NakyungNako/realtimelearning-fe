import { Avatar, Button, Stack } from "@mui/material";
import useAuth from "../../hooks/useAuth";

export default function UserInfo() {
  const { auth } = useAuth();
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      paddingY={3}
      paddingX={2}
    >
      <Stack direction="row" alignItems="center">
        <Avatar alt="profilePic" src="" sx={{ mr: 2 }} />
        {auth.username}
      </Stack>
      <Button variant="outlined">Sign Out</Button>
    </Stack>
  );
}
