/**
 * My skills (public view)
 */
import { StyleSheet, Text, View } from "react-native";
import SkillsList from "@/src/components/Profile/common/Skills/SkillsList";

export default function MySkills({
    isDark,
    skills,
    allSkills,
    App_Language,
}) {
    return (
        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={[styles.title, { color: isDark ? "white" : "#111" }]}>
                {App_Language.startsWith("ar") ? "مهاراتي" : "My Skills"}
            </Text>

            <SkillsList
                isDark={isDark}
                skills={skills}
                allSkills={allSkills}
                App_Language={App_Language}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 17, fontWeight: "700" },
});
