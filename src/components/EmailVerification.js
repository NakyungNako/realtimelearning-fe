import {
  Button,
  Dialog,
  Grid,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

export default function EmailVerification() {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState();
  const { username, token } = useParams();
  const [isValidToken, setIsValidToken] = useState();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const verifyEmailToken = async (name, emailToken) => {
      const usernameAndToken = {
        username: name,
        emailToken,
      };
      const response = await axios.post(
        "/api/users/verifyEmailToken",
        usernameAndToken
      );
      if (response.data.message === "okay") setIsValidToken(true);
    };
    verifyEmailToken(username, token);
  }, []);

  const handleResend = async (name) => {
    const response = await axios.post("/api/users/resend", {
      username: name,
    });
    setDialog(response.data.message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "90vh" }}
    >
      {isValidToken ? (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" p={1}>
            Email has been verified you can now sign in to the site
          </Typography>
          <Button onClick={handleClick} variant="outlined">
            LOGIN
          </Button>
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" p={1}>
            Something wrong happened, please try again
          </Typography>
          <Button onClick={handleResend} variant="outlined">
            RESEND VERIFICATION
          </Button>
        </Grid>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
