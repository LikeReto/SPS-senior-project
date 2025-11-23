import { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    ScrollView
} from "react-native";
import useImagePicker from "@/src/hooks/CurrentUser/useImagePicker";
import { fixUploaded_File } from "@/src/utils/fixUploaded_File";

import { Ionicons } from "@expo/vector-icons";
import { PREDEFINED_PROJECTS } from "@/src/constants/Degrees_Fields";

export default function AddProjectModal({
    visible,
    onClose,
    onSubmit,
    isDark,
    App_Language,
}) {
    const { pickImage } = useImagePicker();

    const [step, setStep] = useState(1);
    const [projectTitle, setProjectTitle] = useState("");
    const [selectedProject_Type, setSelectedProject_Type] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState("active");

    // status options for show if the other user can see it or is it active or not
    const STATUS_OPTIONS = ["active", "inactive", "hidden"];

    // loading state can be added if needed
    const [UpdatingLoading, setUpdatingLoading] = useState(false);


    const handleSubmit = async () => {
        if (!selectedProject_Type || !price) return;

        let fixed_ProfilePicture_response = ''


        try {
            setUpdatingLoading(true);
            // if there is an image, fix it first
            if (image) {
                fixed_ProfilePicture_response = await fixUploaded_File(image);
            }
            await onSubmit({
                Project_Title: projectTitle?.length > 0 ? projectTitle : selectedProject_Type,
                Project_Type: selectedProject_Type,
                Project_Price: price,
                Project_Image: fixed_ProfilePicture_response?.uri?.length > 0
                    ? fixed_ProfilePicture_response
                    : null,
                Project_Description: description,
                Project_Status: status,
            });
            // Reset modal
            setSelectedProject_Type("");
            setPrice("");
            setImage(null);
            setDescription("");
            setStep(1);
            onClose();
        }
        catch (error) {
            console.log("Error adding project:", error);
        }
        finally {
            setUpdatingLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableOpacity
                style={styles.backdrop}
                onPress={onClose}
                disabled={UpdatingLoading}
            />

            <View
                style={[
                    styles.sheet,
                    { backgroundColor: isDark ? "#1a1a1a" : "#fff" },
                ]}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    <View style={styles.dragLine} />

                    {/* STEP 1 — SELECT PROJECT */}
                    {step === 1 && (
                        <>
                            <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
                                {App_Language.startsWith("ar") ? "اختر نوع المشروع" : "Select Project Type"}
                            </Text>

                            {PREDEFINED_PROJECTS.map((p, i) => {
                                const label = App_Language.startsWith("ar") ? p.ar : p.name;
                                const selected = selectedProject_Type === p.name;

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        disabled={UpdatingLoading}
                                        style={[
                                            styles.option,
                                            selected && { backgroundColor: "#10b98122" },
                                        ]}
                                        onPress={() => {
                                            setSelectedProject_Type(p.name);
                                            setStep(2);
                                        }}
                                    >
                                        <Text style={{ color: isDark ? "#fff" : "#111" }}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </>
                    )}

                    {/* STEP 2 — IMAGE + PRICE + DESC */}
                    {step === 2 && (
                        <>
                            <TouchableOpacity
                                onPress={() => {
                                    // Reset everything
                                    setStep(1);
                                    setPrice("");
                                    setImage(null);
                                    setDescription("");
                                }}
                                disabled={UpdatingLoading}
                                style={styles.backBtn}

                            >
                                <Ionicons name="chevron-back" size={20} color="#10b981" />
                                <Text style={styles.backText}>
                                    {App_Language.startsWith("ar") ? "عودة" : "Back"}
                                </Text>
                            </TouchableOpacity>

                            {/* IMAGE UPLOAD */}
                            <TouchableOpacity
                                disabled={UpdatingLoading}
                                style={styles.imagePicker}
                                onPress={async () => {
                                    const pickedImage = await pickImage({ multiple: false, allowVideo: false });
                                    if (pickedImage) {
                                        console.log(pickedImage);
                                        setImage(pickedImage);
                                    }
                                }}
                            >
                                {image ? (
                                    <Image source={{ uri: image.uri }} style={styles.previewImg} />
                                ) : (
                                    <>
                                        <Ionicons name="image-outline" size={40} color="#10b981" />
                                        <Text style={{ color: isDark ? "#fff" : "#111", marginTop: 5 }}>
                                            {App_Language.startsWith("ar") ? "رفع صورة" : "Upload Image"}
                                            <Text style={{ color: "#777" }}>
                                                {App_Language.startsWith("ar") ? " (اختياري)" : " (optional)"}
                                            </Text>
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            {/* PROJECT TITLE */}
                            <TextInput
                                placeholder={App_Language.startsWith("ar") ? "عنوان المشروع..." : "Project Title..."}
                                placeholderTextColor="#777"
                                style={[styles.input,
                                {
                                    color: isDark ? "#fff" : "#111",
                                }]}
                                value={projectTitle}
                                onChangeText={setProjectTitle}
                                editable={UpdatingLoading ? false : true}
                            />
                            {/* PRICE */}
                            <Text
                                style={{ color: "#FF1F1FFF", marginBottom: 4 }}
                            >
                                {App_Language.startsWith("ar")
                                    ? "مطلوب  *"
                                    : "Required  *"
                                }
                            </Text>
                            <TextInput
                                placeholder={App_Language.startsWith("ar") ? "السعر..." : "Price..."}
                                placeholderTextColor="#777"
                                keyboardType="numeric"
                                style={[styles.input,
                                {
                                    color: isDark ? "#fff" : "#111",
                                    width: '50%'

                                }]}
                                value={price}
                                onChangeText={setPrice}
                                editable={UpdatingLoading ? false : true}
                                // only accept en-numbers
                                onKeyPress={(e) => {
                                    const allowedKeys = "0123456789.";
                                    if (!allowedKeys.includes(e.nativeEvent.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />

                            {/* select STATUS from a row  */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 10,
                                }}
                            >
                                {/* you can translate them but it will only using the 
                            English values in the backend */}
                                {STATUS_OPTIONS.map((option, index) => {
                                    const isSelected = status;
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            disabled={UpdatingLoading}
                                            style={[
                                                styles.option,
                                                {
                                                    flex: 1,
                                                    marginVertical: 15,
                                                    marginRight: index < STATUS_OPTIONS.length - 1 ? 8 : 0,
                                                    backgroundColor: isSelected === "active" && option === "active"
                                                        ? "#10B9815E"
                                                        : isSelected === "inactive" && option === "inactive"
                                                            ? "#F59E0B5E"
                                                            : isSelected === "hidden" && option === "hidden"
                                                                ? "#6B72805E"

                                                                : "#31313141",
                                                },
                                            ]}
                                            onPress={() => setStatus(option)}
                                        >
                                            <Text style={{ color: isDark ? "#fff" : "#111", textAlign: "center" }}>
                                                {App_Language.startsWith("ar") ?
                                                    (option === "active" ? "نشط" :
                                                        option === "inactive" ? "غير نشط" :
                                                            "مخفي")
                                                    : option.charAt(0).toUpperCase() + option.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* DESCRIPTION */}
                            <TextInput
                                placeholder={App_Language.startsWith("ar") ? "الوصف (اختياري)" : "Description (optional)"}
                                placeholderTextColor="#777"
                                style={[
                                    styles.input,
                                    { height: 70, color: isDark ? "#fff" : "#111" },
                                ]}
                                multiline
                                value={description}
                                onChangeText={setDescription}
                                editable={UpdatingLoading ? false : true}
                            />

                            {/* SUBMIT */}
                            <TouchableOpacity
                                style={[styles.submitBtn,
                                {
                                    opacity:
                                        UpdatingLoading
                                            ||
                                            !selectedProject_Type
                                            ||
                                            !price
                                            ? 0.3
                                            : 1,
                                }
                                ]}
                                onPress={handleSubmit}
                                disabled={
                                    UpdatingLoading
                                    ||
                                    !selectedProject_Type
                                    ||
                                    !price
                                }
                            >
                                {UpdatingLoading ?
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                                        {App_Language.startsWith("ar") ? "جارٍ الإضافة..." : "Adding..."}
                                    </Text>
                                    :
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                                        {App_Language.startsWith("ar") ? "إضافة المشروع" : "Add Project"}
                                    </Text>
                                }
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    sheet: {
        height: "70%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    dragLine: {
        width: 45,
        height: 5,
        backgroundColor: "#777",
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 15 },
    option: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 10,
        marginBottom: 8,
    },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    backText: { color: "#10b981", fontWeight: "600", fontSize: 16, marginLeft: 6 },
    imagePicker: {
        height: '100%',
        maxHeight: 130,
        width: '100%',
        maxWidth: 350,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#10b98155",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    previewImg: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    input: {
        backgroundColor: "#272727FF",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    submitBtn: {
        backgroundColor: "#10b981",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
});
