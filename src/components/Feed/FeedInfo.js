import {
  AdminPanelSettings,
  ExitToApp,
  GroupRemove,
  MoreVert,
  Security,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useState } from "react";
import _ from "lodash";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGroup from "../../hooks/useGroup";

export default function FeedInfo() {
  const axiosPrivate = useAxiosPrivate();
  const updateGroup = useGroup();
  const [openDialog, setOpenDialog] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const open = Boolean(anchorEl);
  const handleClick = (index) => (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { auth, selectedGroup, setSelectedGroup, groups, setGroups } =
    useAuth();
  const admins = selectedGroup.groupAdmin;
  const isAdmin = admins.some((user) => user._id === auth.id);
  const isOwner = _.isEqual(selectedGroup.groupOwner._id, auth.id);

  const handleAdmin = async (role, userId) => {
    let response;
    if (role === "member") {
      response = await axiosPrivate.put("/api/group/addadmin", {
        groupId: selectedGroup._id,
        userId,
      });
    } else {
      response = await axiosPrivate.put("/api/group/removeadmin", {
        groupId: selectedGroup._id,
        userId,
      });
    }
    const updatedGroup = response.data;
    const newGroups = groups.map((e) => {
      if (e._id === updatedGroup._id) {
        return updatedGroup;
      }
      return e;
    });
    setGroups(newGroups);
    updateGroup(updatedGroup);
  };

  const handleRemove = async (userId) => {
    const response = await axiosPrivate.put("/api/group/remove", {
      groupId: selectedGroup._id,
      userId,
    });
    const updatedGroup = response.data;
    const newGroups = groups.map((e) => {
      if (e._id === updatedGroup._id) {
        return updatedGroup;
      }
      return e;
    });
    setGroups(newGroups);
    updateGroup(updatedGroup);
  };

  const handleLeave = async (userId, role) => {
    if (role === "owner") {
      return setOpenDialog(true);
    }
    await axiosPrivate.put("/api/group/remove", {
      groupId: selectedGroup._id,
      userId,
    });
    const newGroups = groups.filter((grp) => grp._id !== selectedGroup._id);
    setSelectedGroup(null);
    setGroups(newGroups);

    return null;
  };

  const handleOwner = async (userId) => {
    const response = await axiosPrivate.put("/api/group/giveowner", {
      groupId: selectedGroup._id,
      userId,
    });
    const updatedGroup = response.data;
    const newGroups = groups.map((e) => {
      if (e._id === updatedGroup._id) {
        return updatedGroup;
      }
      return e;
    });
    setGroups(newGroups);
    updateGroup(updatedGroup);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Grid p={2} marginRight={2}>
      <Grid container direction="column" alignItems="center" sx={{ m: 1 }}>
        <Avatar alt="grouppic" sx={{ width: 150, height: 150, mb: 2 }} />
        <Typography>{selectedGroup.groupname}</Typography>
      </Grid>
      <Divider />
      <Grid container direction="column" sx={{ m: 2 }}>
        <Typography sx={{ fontWeight: "bold" }}>Group Member</Typography>
        <List>
          {selectedGroup.users.map((user, index) => (
            <Box key={user._id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="more"
                    onClick={handleClick(index)}
                  >
                    <MoreVert />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.role} />
              </ListItem>
              <Divider variant="middle" />
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open && index === currentIndex}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      // eslint-disable-next-line quotes
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
                {isAdmin && user._id !== auth.id && user.role !== "owner" && (
                  <Box>
                    <Divider />
                    <MenuItem onClick={() => handleAdmin(user.role, user._id)}>
                      <ListItemIcon>
                        <AdminPanelSettings fontSize="small" />
                      </ListItemIcon>
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </MenuItem>
                    <MenuItem onClick={() => handleRemove(user._id)}>
                      <ListItemIcon>
                        <GroupRemove fontSize="small" />
                      </ListItemIcon>
                      Remove Member
                    </MenuItem>
                  </Box>
                )}
                {user._id === auth.id && (
                  <MenuItem onClick={() => handleLeave(auth.id, user.role)}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    Leave Group
                  </MenuItem>
                )}
                {isOwner && user._id !== auth.id && (
                  <MenuItem onClick={() => handleOwner(user._id)}>
                    <ListItemIcon>
                      <Security fontSize="small" />
                    </ListItemIcon>
                    Make Owner
                  </MenuItem>
                )}
              </Menu>
            </Box>
          ))}
        </List>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Owner cannot leave group, please give to someone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Okay</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
