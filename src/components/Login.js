/* eslint-disable no-unused-expressions */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  //   Dialog,
  //   DialogContent,
  //   DialogContentText,
  //   DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { GOOGLE_CLIENT_ID } from "../config/config";

const LOGIN_URL = "/api/users/login";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const LoginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const mutation = useMutation(
    (user) =>
      axios.post(
        LOGIN_URL,
        {
          username: user.username,
          password: user.password,
        },
        {
          withCredentials: true,
        }
      ),
    {
      onSuccess: (data) => {
        const accessToken = data.data.token;
        const { id, username, email } = data.data;
        console.log(data.data);
        setAuth({ id, username, email, accessToken });
        setMessage(data.data.message);
        setOpenDialog(true);
        mutation.reset();
      },
      onError: (data) => {
        setMessage(data.data.message);
        setOpenDialog(true);
        mutation.reset();
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      // eslint-disable-next-line no-use-before-define
      mutation.mutate(values);
    },
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDialog(false);
    formik.setSubmitting(false);
    navigate(from, { replace: true });
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  const handleCallbackResponse = async (response) => {
    try {
      const googleLogin = await axios.post("/api/users/login/google", {
        credential: response.credential,
      });
      const accessToken = googleLogin.data.token;
      const { id, username, picture, email } = googleLogin.data;
      setAuth({ id, username, picture, email, accessToken });
      setMessage(googleLogin.data.message);
      setOpenDialog(true);
    } catch (error) {
      setMessage(error);
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outlined",
      text: "sigin_with",
      size: "large",
      width: 300,
    });
  }, []);

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "90vh" }}
    >
      <Paper elevation={20} style={{ padding: 30, width: 300 }}>
        <Grid align="center" marginBottom={5}>
          <Typography variant="h5">Welcome, buddy!</Typography>
        </Grid>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Username"
                placeholder="Enter your username..."
                type="text"
                {...getFieldProps("username")}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                {...getFieldProps("password")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
              <Stack>
                <FormControlLabel
                  control={
                    <Checkbox onChange={togglePersist} checked={persist} />
                  }
                  label="Remember me"
                />
                {/* <Link>Forgot password?</Link> */}
              </Stack>
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Log in
              </Button>
              <Divider>OR</Divider>
              <Grid container justifyContent="center">
                <div id="signInDiv" />
              </Grid>
              <Grid container justifyContent="center">
                Not have account?
                <Link to="/signup">Register</Link>
              </Grid>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Submit Report</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {message}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Okay</Button>
                </DialogActions>
              </Dialog>
            </Stack>
          </Form>
        </FormikProvider>
      </Paper>
    </Grid>
  );
}
