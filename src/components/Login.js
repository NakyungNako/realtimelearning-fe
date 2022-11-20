import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
} from "@mui/material";
import { Stack } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { Form, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "../api/axios";

const LOGIN_URL = "/api/users/login";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");
  const { setAuth, auth } = useAuth();
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
        const id = data.data.id;
        const username = data.data.username;
        console.log(data.data);
        setAuth({ id, username, accessToken });
        console.log("id", auth.id);
        console.log("username", auth.username);
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

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper elevation={20} style={{ padding: 30, width: 300 }}>
        <Grid align="center">
          <h2>Login</h2>
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
                  control={<Checkbox {...getFieldProps("remember")} />}
                  label="Remember me"
                />
                <Link>Forgot password?</Link>
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
              <Grid container justifyContent="center">
                Not have account?<Link to="/signup">Register</Link>
              </Grid>
              <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Submit Report"}
                </DialogTitle>
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
