import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectList({
    projects,
    isDark,
    App_Language,
    onRequestProject,
    setModalVisible,
}) {

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 15 }}
        >
            {/* ADD NEW PROJECT CARD */}
            {projects.length <= 0 &&
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: isDark ? "#1a1a1a" : "#e6f9f0",
                        width: 110,
                        height: 140,
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 12,
                    }}
                >
                    <Ionicons name="add" size={32} color={isDark ? "#fff" : "#10b981"} />
                    <Text style={{ color: isDark ? "#fff" : "#10b981", marginTop: 6 }}>
                        {App_Language.startsWith("ar") ? "أضف مشروع" : "Add Project"}
                    </Text>
                </TouchableOpacity>
            }
            {/* PROJECT CARDS */}
            {projects.length > 0 ? (
                projects.map((project, index) => (
                    <View
                        key={index}
                        style={[
                            styles.card,
                            { backgroundColor: isDark ? "#111" : "#fff" },
                        ]}
                    >
                        {project.Project_Image && (
                            <Image
                                source={{ uri: project.Project_Image }}
                                style={styles.projectImage}
                            />
                        )}

                        <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
                            {project.Project_Title}
                        </Text>

                        <Text style={{ color: isDark ? "#bbb" : "#555", fontSize: 13, marginVertical: 6 }}>
                            {project.Project_Type}
                        </Text>

                        <Text style={{ color: isDark ? "#bbb" : "#555", fontSize: 13 }}>
                            {App_Language.startsWith("ar")
                                ? `السعر: ${project.Project_Price} ريال`
                                : `Price: ${project.Project_Price} SAR`}
                        </Text>

                        <TouchableOpacity
                            style={styles.requestBtn}
                            onPress={() => onRequestProject(project)}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                {App_Language.startsWith("ar") ? "اطلب الآن" : "Request Now"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text
                    style={{
                        color: isDark ? "#aaa" : "#888",
                        alignSelf: "center",
                        marginTop: 10,
                    }}
                >
                    {App_Language.startsWith("ar") ? "لا توجد مشاريع" : "No projects"}
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        padding: 12,
        borderRadius: 14,
        marginRight: 12,
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    projectImage: {
        width: "100%",
        height: 80,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: "700",
    },
    requestBtn: {
        marginTop: 15,
        paddingVertical: 8,
        backgroundColor: "#10b981",
        borderRadius: 8,
        alignItems: "center",
    },
});
