import React, { useRef, useEffect } from "react";
import {
    Modal,
    Pressable,
    Animated,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function DarkModeModal({ visible, onClose, App_Language, isDark, toggleDarkMode }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(40);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="none">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalBox,
                        {
                            backgroundColor: isDark ? "#1a1a1a" : "white",
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
                        {App_Language?.startsWith("ar") ?
                            "اختر الوضع" : "Choose Mode"
                        }
                    </Text>

                    {/* Light Mode Option */}
                    <TouchableOpacity
                        onPress={() => {
                            toggleDarkMode("light");
                            onClose();
                        }}
                        style={[
                            styles.optionBtn,
                            { backgroundColor: !isDark ? "#3B3B3BFF" : "#f2f2f2" },
                        ]}
                    >
                        <Ionicons
                            name="sunny"
                            size={20}
                            color={!isDark ? "#fff" : "#111"}
                        />
                        <Text
                            style={[
                                styles.optionText,
                                { color: !isDark ? "#fff" : "#111" },
                            ]}
                        >
                            {App_Language?.startsWith("ar")
                                ? "الوضع الفاتح"
                                : "Light Mode"
                            }
                        </Text>
                    </TouchableOpacity>

                    {/* Dark Mode Option */}
                    <TouchableOpacity
                        onPress={() => {
                            toggleDarkMode("dark");
                            onClose();
                        }}
                        style={[
                            styles.optionBtn,
                            { backgroundColor: isDark ? "#3B3B3BFF" : "#f2f2f2" },
                        ]}
                    >
                        <Ionicons
                            name="moon"
                            size={20}
                            color={isDark ? "#fff" : "#111"}
                        />
                        <Text
                            style={[
                                styles.optionText,
                                { color: isDark ? "#fff" : "#111" },
                            ]}
                        >
                            {App_Language?.startsWith("ar")
                                ? "الوضع الداكن"
                                : "Dark Mode"
                            }
                        </Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
                        <Text style={{ color: "white", fontWeight: "600" }}>
                            {App_Language?.startsWith("ar") ? "تم" : "Done"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    modalBox: {
        width: "100%",
        padding: 18,
        paddingBottom: 40,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 14,
        textAlign: "center",
    },
    optionBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: "center",
        gap: 8,
    },
    optionText: {
        fontWeight: "600",
        fontSize: 16,
    },
    doneBtn: {
        backgroundColor: "#10b981",
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
        alignItems: "center",
    },
});
