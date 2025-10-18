import { useState } from "react";
import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

// Validation schema for registration
const registerSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  location: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  picture: yup.mixed().required("Required"),
});

// Initial form values for registration
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const RegisterForm = () => {
  const [serverError, setServerError] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Register function
  const register = async (values, onSubmitProps) => {
    setServerError("");
    const formData = new FormData();
    for (let key in values) formData.append(key, values[key]);
    formData.append("picturePath", values.picture.name);

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Registration failed");
      onSubmitProps.resetForm();
      alert("Registration successful! You can now login.");
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
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
        onSubmit={register}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box display="grid" gap="20px">
              <TextField
                label="First Name"
                name="firstName"
                value={values.firstName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                variant="outlined"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                variant="outlined"
              />
              <TextField
                label="Location"
                name="location"
                value={values.location}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.location && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                variant="outlined"
              />
              <TextField
                label="Occupation"
                name="occupation"
                value={values.occupation}
                onBlur={handleBlur}
                onChange={handleChange}
                error={touched.occupation && Boolean(errors.occupation)}
                helperText={touched.occupation && errors.occupation}
                variant="outlined"
              />

              <Box border={`1px solid #1D9BF0`} borderRadius="5px" p="1rem">
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed #1D9BF0`}
                      p="1rem"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <Typography>Add Picture Here</Typography>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture.name}</Typography>
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>

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
              REGISTER
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;
