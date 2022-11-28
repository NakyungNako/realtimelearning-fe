import { Settings } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function UserInfo() {
  const { auth } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleProfile = () => {
    setOpen(true);
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      paddingY={3}
      paddingX={2}
    >
      <Stack direction="row" alignItems="center">
        <Avatar alt="profilePic" src={auth.picture} sx={{ mr: 2 }} />
        {auth.username}
      </Stack>
      <IconButton onClick={handleProfile}>
        <Settings />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Grid container direction="column" alignItems="center">
            <Avatar
              alt="profile"
              src={auth.picture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h6">Profile Picture</Typography>
            <TextField
              disabled
              id="filled-disabled"
              label="Username"
              defaultValue={auth.username}
              variant="filled"
              sx={{ marginY: 2, width: 400 }}
            />
            <TextField
              disabled
              id="filled-disabled"
              label="Email"
              defaultValue={auth.email}
              variant="filled"
              sx={{ width: 400 }}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
