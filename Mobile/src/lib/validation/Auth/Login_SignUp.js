// src/lib/Auth/Login_SignUp.js
import * as Yup from "yup";


// ✅ Login Validation Schema
export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});

// ✅ Signup Validation Schema
export const signupValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Name too short")
        .max(30, "Name too long")
        .required("Name is required"),

    username: Yup.string()
        .min(3, "Username too short")
        .max(25, "Username too long")
        .required("Username is required")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
        .trim(),

    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .required("Password is required"),
});
