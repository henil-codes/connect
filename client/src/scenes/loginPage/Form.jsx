import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { motion } from "framer-motion";

/* ---------------- VALIDATION SCHEMAS ---------------- */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const resetSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

/* ---------------- INITIAL VALUES ---------------- */
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};
const initialValuesLogin = { email: "", password: "" };
const initialValuesReset = { email: "" };

/* ---------------- COMPONENT ---------------- */
const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isReset = pageType === "reset";

  /* ---------------- FUNCTIONS ---------------- */
  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
    if (savedUser) setPageType("login");
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
      navigate("/home");
    }
  };

  const resetPassword = async (values, onSubmitProps) => {
    const response = await fetch("http://localhost:3001/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: values.email }),
    });
    const result = await response.json();
    onSubmitProps.resetForm();
    alert(result.message || "If the email exists, password reset link sent!");
    setPageType("login");
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isReset) await resetPassword(values, onSubmitProps);
  };

  /* ---------------- UI ---------------- */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #007BFF 0%, #E3F2FD 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "all 0.5s ease",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={12}
          sx={{
            width: isNonMobile ? "420px" : "90%",
            padding: "2.5rem",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            color: "#0d47a1",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            sx={{ color: "#0d47a1" }}
          >
            {isLogin ? "Welcome Back" : isRegister ? "Create Account" : "Reset Password"}
          </Typography>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={
              isLogin
                ? initialValuesLogin
                : isRegister
                ? initialValuesRegister
                : initialValuesReset
            }
            validationSchema={
              isLogin ? loginSchema : isRegister ? registerSchema : resetSchema
            }
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  {isRegister && (
                    <>
                      <TextField
                        label="First Name"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        label="Last Name"
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                        sx={{ gridColumn: "span 2" }}
                      />
                      <TextField
                        label="Email"
                        name="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.Email}
                        error={touched.Email && Boolean(errors.Email)}
                        helperText={touched.Email && errors.Email}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        label="password"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </>
                  )}

                  {(isLogin || isReset) && (
                    <TextField
                      label="Email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 4" }}
                    />
                  )}

                  {isLogin && (
                    <TextField
                      label="Password"
                      type="password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ gridColumn: "span 4" }}
                    />
                  )}
                </Box>

                {/* BUTTON */}
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    mt: "2rem",
                    p: "0.9rem",
                    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(90deg, #42a5f5, #1976d2)",
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {isLogin
                    ? "LOGIN"
                    : isRegister
                    ? "REGISTER"
                    : "SEND RESET LINK"}
                </Button>

                {/* SWITCH LINKS */}
                <Typography
                  onClick={() => {
                    if (isLogin) setPageType("register");
                    else if (isRegister) setPageType("login");
                    else if (isReset) setPageType("login");
                    resetForm();
                  }}
                  sx={{
                    textAlign: "center",
                    mt: "1.5rem",
                    textDecoration: "underline",
                    color: "#0d47a1",
                    "&:hover": { cursor: "pointer", color: "#1565c0" },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : isRegister
                    ? "Already have an account? Login here."
                    : "Back to Login"}
                </Typography>

                {isLogin && (
                  <Typography
                    onClick={() => {
                      setPageType("reset");
                      resetForm();
                    }}
                    sx={{
                      mt: "1rem",
                      textAlign: "center",
                      textDecoration: "underline",
                      color: "#0d47a1",
                      "&:hover": { cursor: "pointer", color: "#1565c0" },
                    }}
                  >
                    Forgot Password?
                  </Typography>
                )}
              </form>
            )}
          </Formik>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Form;
