// src/screens/auth/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Formik } from "formik";

import { loginValidationSchema } from "@/src/lib/validation/Auth/Login_SignUp";

import { useAuth } from "@/src/Contexts/AuthContext";

export default function LoginScreen() {
    const { Expo_Router, App_Language, darkMode, loginUser } = useAuth();
    const isDark = darkMode === "dark";

    const initialValues = { email: "", password: "" };

    const [loading, setLoading] = useState(false);

    const submit = async (values) => {
        setLoading(true);
        try {
            await loginUser(values);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={"padding"}
            >
                <TouchableOpacity
                    onPress={() => Expo_Router.replace("/")}
                >
                    <Ionicons name="arrow-back" size={28} color={isDark ? "white" : "#111"} />
                </TouchableOpacity>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "space-around" }}
                >
                    <Formik
                        initialValues={initialValues}
                        validationSchema={loginValidationSchema}
                        onSubmit={(values) => submit(values)}
                        validateOnMount={true}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
                            <View>
                                <Animated.Text entering={FadeInUp} style={styles.title}>
                                    {App_Language.startsWith("ar")
                                        ? "مرحبًا بعودتك 👋"
                                        : "Welcome Back 👋"
                                    }
                                </Animated.Text>

                                <TextInput
                                    placeholderTextColor={isDark ? "#888" : "#555"}
                                    placeholder={App_Language.startsWith("ar")
                                        ? "البريد الإلكتروني"
                                        : "Email"}
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    style={styles.input(darkMode)}
                                />
                                <TextInput
                                    placeholderTextColor={isDark ? "#888" : "#555"}
                                    placeholder={App_Language.startsWith("ar")
                                        ? "كلمة المرور"
                                        : "Password"}
                                    secureTextEntry
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    style={styles.input(darkMode)}
                                />

                                <TouchableOpacity
                                    style={!values.email || !values.password || values.password.length < 8 || !values.email.includes("@")
                                        ? styles.btnDisabled
                                        : styles.btn}
                                    onPress={() => handleSubmit()}
                                    disabled={
                                        !values.email || !values.password
                                        || values.password.length < 8 || !values.email.includes("@")
                                    }

                                >
                                    {loading
                                        ? <ActivityIndicator color="#fff" />
                                        : <Text style={styles.btnText}>{App_Language.startsWith("ar") ? "تسجيل الدخول" : "Login"}</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <TouchableOpacity onPress={() => Expo_Router.push("Signup")}>
                        <Text style={styles.link}>{App_Language.startsWith("ar") ? "إنشاء حساب" : "Create an account"}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 25,
        backgroundColor: "#000"
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 30
    },
    input: (darkMode) => ({
        color: darkMode === "dark" ? "#fff" : "#111",
        fontSize: 16,
        backgroundColor: "#111",
        padding: 16,
        borderRadius: 16,
        marginVertical: 8
    }),
    btn: {
        backgroundColor: "#6366f1",
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
        alignItems: "center"
    },
    btnDisabled: {
        opacity: 0.6,
        backgroundColor: "#555",
        padding: 16,
        borderRadius: 16,
        marginTop: 10,
        alignItems: "center"
    },
    btnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    },
    link: {
        color: "#10b981",
        marginTop: 15,
        textAlign: "center",
        fontWeight: "600"
    },
});
