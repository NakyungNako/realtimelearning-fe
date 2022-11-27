import {
  Box,
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
      console.log(username);
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
    <Grid container direction="column" alignItems="center">
      {isValidToken ? (
        <Box>
          <Typography>
            Email has been verified you can now sign in to the site
          </Typography>
          <Button onClick={handleClick}>LOGIN</Button>
        </Box>
      ) : (
        <Box>
          <Typography>Something wrong happened, please try again</Typography>
          <Button onClick={() => handleResend(username)}>
            RESEND VERIFICATION
          </Button>
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Use Google&apos;s location service?
        </DialogTitle>
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
