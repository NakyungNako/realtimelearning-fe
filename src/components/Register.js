import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import { Form, FormikProvider, useFormik } from "formik";
import { Stack } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const REGISTER_URL = "/api/users/register";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");

  const RegisterSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .trim("Username cannot include leading and trailing spaces")
      .strict(true)
      .required("Username is required"),
    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password minimim length is 6")
      .trim("Password cannot include leading and trailing spaces")
      .strict(true)
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password not matched")
      .trim("The contact name cannot include leading and trailing spaces")
      .strict(true)
      .required("Required"),
  });

  const mutation = useMutation(
    (user) =>
      axios.post(REGISTER_URL, {
        username: user.username,
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
      }),
    {
      onSuccess: (data) => {
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
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
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
  };

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } =
    formik;

  const paperStyle = { padding: 30, width: 300 };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper elevation={20} style={paperStyle}>
        <Grid align="center">
          <h2>Register</h2>
        </Grid>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Username"
                placeholder="Enter your username..."
                {...getFieldProps("username")}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                type="email"
                label="Email Adress"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
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
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Confirm Password"
                {...getFieldProps("confirmPassword")}
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
                error={Boolean(
                  touched.confirmPassword && errors.confirmPassword
                )}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Submit
              </Button>
              <Grid container justifyContent="center">
                Already register?
                <Link to="/login">Login</Link>
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
