import { useState } from "react";
import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

// Validation schema for login
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

// Initial form values for login
const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [serverError, setServerError] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Login function
  const login = async (values, onSubmitProps) => {
    setServerError("");

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Login failed");
      
      onSubmitProps.resetForm();
      dispatch(setLogin({ user: data.user, token: data.token }));
      navigate("/home");
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <Box
      width={isNonMobile ? "450px" : "90%"}
      m="3rem auto"
      p="2rem"
      borderRadius="1rem"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Formik
        initialValues={initialValuesLogin}
        validationSchema={loginSchema}
        onSubmit={login}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px">
              <TextField
                label="Email"
                name="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
              />
            </Box>

            {serverError && (
              <Typography color="#D32F2F" textAlign="center" mt="0.5rem" mb="0.5rem">
                {serverError}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: "1.5rem",
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1D9BF0", color: "#fff" },
              }}
            >
              LOGIN
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginForm;