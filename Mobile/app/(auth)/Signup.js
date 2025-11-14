// src/screens/auth/SignupScreen.js
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import { useAuth } from "@/src/Contexts/AuthContext";
import { signupValidationSchema } from "@/src/lib/validation/Auth/Login_SignUp";

export default function SignupScreen() {
    const { Expo_Router, darkMode, App_Language, registerUser } = useAuth();

    const initialValues = {
        name: "",
        username: "",
        email: "",
        password: ""
    };

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // the regex is doing these : the password must be at least 8 characters long
    // it must contain at least 1 uppercase letter
    // it must contain at least 1 lowercase letter
    // it must contain at least 1 number
    // it must contain at least 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


    const submit = async (values) => {
        setLoading(true);
        try {
            await registerUser(values);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container(darkMode)}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <TouchableOpacity onPress={() => Expo_Router.back()} disabled={loading}>
                    <Ionicons name="arrow-back" size={28} color={darkMode === "light" ? "#111" : "white"} />
                </TouchableOpacity>

                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-around" }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={signupValidationSchema}
                        onSubmit={submit}
                        validateOnMount
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => {
                            const isPasswordInvalid =
                                values.password.length > 0 && !passwordRegex.test(values.password);

                            const disableBtn =
                                !isValid || isPasswordInvalid || loading;

                            return (
                                <View>
                                    <Animated.Text entering={FadeInUp} style={styles.title(darkMode)}>
                                        {App_Language.startsWith("ar") ? "إنشاء حساب ✨" : "Create Account ✨"}
                                    </Animated.Text>

                                    {/* Name */}
                                    <TextInput
                                        placeholder={App_Language.startsWith("ar") ? "الاسم" : "Name"}
                                        placeholderTextColor={darkMode === "light" ? "#555555" : "#888888"}
                                        value={values.name}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        style={[
                                            styles.input(darkMode),
                                            touched.name && values.name.length >= 1 && errors.name && styles.errorBorder
                                        ]}
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.errorText}>{errors.name}</Text>
                                    )}

                                    {/* Username */}
                                    <TextInput
                                        placeholder={App_Language.startsWith("ar") ? "اسم المستخدم" : "Username"}
                                        placeholderTextColor={darkMode === "light" ? "#555555" : "#888888"}
                                        value={values.username.toLowerCase().replace(/\s/g, "")}
                                        onChangeText={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        style={[
                                            styles.input(darkMode),
                                            touched.username && values.username.length >= 1 && errors.username && styles.errorBorder
                                        ]}
                                    />
                                    {touched.username && errors.username && (
                                        <Text style={styles.errorText}>{errors.username}</Text>
                                    )}

                                    {/* Email */}
                                    <TextInput
                                        placeholder={App_Language.startsWith("ar") ? "البريد الإلكتروني" : "Email"}
                                        placeholderTextColor={darkMode === "light" ? "#555555" : "#888888"}
                                        value={values.email.toLowerCase().replace(/\s/g, "")}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        style={[
                                            styles.input(darkMode),
                                            touched.email && values.email.length >= 1 && errors.email && styles.errorBorder
                                        ]}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.errorText}>{errors.email}</Text>
                                    )}

                                    {/* Password */}
                                    <View style={{ position: "relative" }}>
                                        <TextInput
                                            placeholder={App_Language.startsWith("ar") ? "كلمة المرور" : "Password"}
                                            placeholderTextColor={darkMode === "light" ? "#555555" : "#888888"}
                                            secureTextEntry={!showPassword}
                                            value={values.password.replace(/\s/g, "")}
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            style={[
                                                styles.input(darkMode),
                                                values.password.length >= 1 && isPasswordInvalid && styles.errorBorder
                                            ]}
                                        />

                                        {/* Eye Icon */}
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={{ position: "absolute", right: 15, top: 22 }}
                                        >
                                            <Ionicons
                                                name={showPassword ? "eye-off" : "eye"}
                                                size={22}
                                                color="#888"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Password Rules */}
                                    {values.password.length > 0 && isPasswordInvalid && (
                                        <View style={{ marginTop: 4 }}>
                                            <Text style={styles.errorText}>• Minimum 8 characters</Text>
                                            <Text style={styles.errorText}>• 1 uppercase letter</Text>
                                            <Text style={styles.errorText}>• 1 lowercase letter</Text>
                                            <Text style={styles.errorText}>• 1 number</Text>
                                            <Text style={styles.errorText}>• 1 special character</Text>
                                        </View>
                                    )}

                                    {/* Submit Button */}
                                    <TouchableOpacity
                                        style={disableBtn ? styles.btnDisabled : styles.btn}
                                        onPress={handleSubmit}
                                        disabled={disableBtn}
                                    >
                                        {loading ? <ActivityIndicator color="#fff" /> :
                                            <Text style={styles.btnText}>
                                                {App_Language.startsWith("ar") ? "تسجيل" : "Sign Up"}
                                            </Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    </Formik>

                    <TouchableOpacity onPress={() => Expo_Router.back()}>
                        <Text style={styles.link}>
                            {App_Language.startsWith("ar") ? "لديك حساب بالفعل؟" : "Already have an account?"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: (darkMode) => ({
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 25,
        backgroundColor: darkMode === "light" ? "#f5f5f5" : "#0a0a0a",
    }),
    title: (darkMode) => ({
        fontSize: 36,
        fontWeight: "800",
        color: darkMode === "light" ? "#111" : "#fff",
        marginBottom: 30
    }),
    input: (darkMode) => ({
        color: darkMode === "light" ? "#111" : "#fff",
        fontSize: 16,
        backgroundColor: darkMode === "light" ? "#f0f0f0" : "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        marginVertical: 8
    }),

    errorBorder: { borderWidth: 1, borderColor: "red" },

    errorText: { color: "red", fontSize: 13, marginLeft: 4, marginBottom: 4 },

    btn: {
        backgroundColor: "#6366f1", padding: 16, borderRadius: 16,
        marginTop: 12, alignItems: "center"
    },
    btnDisabled: {
        opacity: 0.6, backgroundColor: "#555", padding: 16, borderRadius: 16,
        marginTop: 12, alignItems: "center"
    },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
    link: { color: "#10b981", marginTop: 15, textAlign: "center", fontWeight: "600" },
});
