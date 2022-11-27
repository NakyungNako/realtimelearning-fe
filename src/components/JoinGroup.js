import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useGroup from "../hooks/useGroup";

export default function JoinGroup() {
  const { grouptoken } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const updateGroup = useGroup();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getGroup = async () => {
      try {
        const response = await axiosPrivate.put(
          "/api/group/add",
          { groupToken: grouptoken, userId: auth.id },
          { signal: controller.signal }
        );

        if (response.data?.data) {
          updateGroup(response.data.data);
        }

        isMounted && setMessage(response.data.message);
      } catch (err) {
        console.log(err);
      }
    };
    getGroup();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  const handleClose = () => {
    setOpen(false);
    navigate("/main", { replace: true });
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Joined group {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
