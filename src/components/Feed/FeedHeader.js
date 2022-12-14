import { PersonAdd } from "@mui/icons-material";
import {
  Button,
  Typography,
  Stack,
  Grid,
  AvatarGroup,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CustomizedInputBase from "../CustomizedInputBase/CustomizedInputBase";
import EditCustomizedInputBase from "../CustomizedInputBase/EditCustomizedInputBase";

export default function FeedHeader() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [token, setToken] = useState("");
  const { auth, selectedGroup } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const adminList = selectedGroup.groupAdmin;
  const isAdmin = adminList.some((user) => user._id === auth.id);

  const handleAddMember = async (groupId) => {
    const response = await axiosPrivate.post("/api/group/createToken", {
      groupId,
    });
    setToken(response.data.token);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAlert(false);
  };

  const sendEmail = async (email) => {
    const groupId = selectedGroup._id;
    if (email !== "") {
      const response = await axiosPrivate.post("/api/group/sendinvitation", {
        groupId,
        userEmail: email,
      });
      setAlertText(response.data.message);
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setOpenAlert(false);
    }, 5000);
  }, [openAlert]);

  return (
    <Stack direction="row" p={2}>
      <Stack direction="column" justifyContent="flex-start" flex={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {selectedGroup.groupname}
        </Typography>
        {/* <Typography variant="body1">{selectedGroup.groupdesc}</Typography> */}
      </Stack>
      <Grid container alignItems="center" justifyContent="flex-end" flex={1}>
        {isAdmin && (
          <Button
            color="secondary"
            onClick={() => handleAddMember(selectedGroup._id)}
            startIcon={<PersonAdd />}
          >
            Add Member
          </Button>
        )}
        <AvatarGroup max={2}>
          {selectedGroup.users.map((user) => (
            <Avatar alt={user.username} key={user._id} src={user.picture} />
          ))}
        </AvatarGroup>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>Invite friends to {selectedGroup.groupname}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send this invite link to your friends
          </DialogContentText>
          <CustomizedInputBase token={token} />
          <DialogContentText>Or send to email</DialogContentText>
          <EditCustomizedInputBase
            text="Enter Email"
            tooltip="Send invite link"
            buttonText="send"
            handleClick={sendEmail}
          />
        </DialogContent>
        {openAlert && <Alert sx={{ marginX: 2 }}>{alertText}</Alert>}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
