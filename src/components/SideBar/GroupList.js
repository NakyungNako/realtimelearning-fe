import {
  Box,
  Button,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Alert,
  Snackbar,
} from "@mui/material";
import { KeyboardArrowDown, People, AddBoxOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import useGroup from "../../hooks/useGroup";
import EditCustomizedInputBase from "../CustomizedInputBase/EditCustomizedInputBase";

export default function GroupList() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, selectedGroup, groups, setGroups } = useAuth();
  const updateGroup = useGroup();
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/api/group/", {
          params: {
            userId: auth.id,
          },
          signal: controller.signal,
        });
        isMounted && setGroups(response.data);
        console.log("axiosPrivate", response.data);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, location, navigate]);

  const handleSelectedGroup = (group) => {
    updateGroup(group);
  };

  const handleAddGroup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleCreateGroup = async (groupname) => {
    const response = await axiosPrivate.post("/api/group/create", {
      groupname,
      user: auth.id,
    });
    const newGroup = response.data;
    setGroups((oldGroups) => [...oldGroups, newGroup]);
    updateGroup(newGroup);
    setOpen(false);
  };

  const handleJoinGroup = async (link) => {
    const groupToken = link.substr(32, 8);
    const response = await axiosPrivate.put("/api/group/add", {
      groupToken,
      userId: auth.id,
    });
    if (response.data?.data) {
      const newGroup = response.data.data;
      setGroups((oldGroups) => [...oldGroups, newGroup]);
      updateGroup(newGroup);
    }
    setAlertText(response.data.message);
    setOpenAlert(true);
    setOpen(false);
  };

  return (
    <Box>
      <ListItemButton>
        <ListItemText primary="Group List" />
        <KeyboardArrowDown />
      </ListItemButton>
      {groups?.map((group) => (
        <ListItemButton
          key={group._id}
          onClick={() => handleSelectedGroup(group)}
          sx={
            selectedGroup?._id === group._id
              ? { bgcolor: "#64b5f6", "&:hover": { bgcolor: "#2196f3" } }
              : { bgcolor: "white" }
          }
        >
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary={group.groupname} />
        </ListItemButton>
      ))}
      <Grid container p={2}>
        <Button
          variant="outlined"
          startIcon={<AddBoxOutlined />}
          onClick={handleAddGroup}
        >
          Add a Group
        </Button>
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>Add a Group</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new group</DialogContentText>
          <EditCustomizedInputBase
            text="Enter group name..."
            tooltip="create a new group"
            buttonText="create"
            handleClick={handleCreateGroup}
          />
          <DialogContentText marginTop={2}>Or join them</DialogContentText>
          <EditCustomizedInputBase
            text="Invitation link"
            tooltip="join a group"
            buttonText="Go"
            handleClick={handleJoinGroup}
          />
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity="info" sx={{ marginX: 2 }}>
          {alertText}
        </Alert>
      </Snackbar>
    </Box>
  );
}
