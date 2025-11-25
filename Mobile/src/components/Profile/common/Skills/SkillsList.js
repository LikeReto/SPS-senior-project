import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MySkills({
  isDark,
  skills, // array of skill names (values saved in DB)
  allSkills, // full skills list with name, icon, emoji, label
  App_Language,
}) {

  // map each selected skill to its icon/emoji and label
  const renderSkillTag = (skillName) => {
    const skill = allSkills.find(s => s.name === skillName);
    if (!skill) return skillName; // fallback if skill not found

    const label = App_Language.startsWith("ar") ? skill.label.ar : skill.label.en;

    return (
      <View
        key={skillName}
        style={[styles.skillTag, { backgroundColor: isDark ? "#292828FF" : "#e6f9f0" }]}
      >
        {skill.icon ? (
          <skill.icon size={16} color={isDark ? "#fff" : "#10b981"} style={{ marginRight: 6 }} />
        ) : skill.emoji ? (
          <Text style={{ fontSize: 16, marginRight: 6 }}>{skill.emoji}</Text>
        ) : null}
        <Text style={{ color: isDark ? "#fff" : "#10b981" }}>{label}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center"
      }}
      style={{
        maxHeight: 170,
        marginTop: 10

      }}>
      <View style={styles.skills}>
        {skills.length > 0 ? skills.map(renderSkillTag) : (
          <Text style={{ color: isDark ? "#aaa" : "#888" }}>
            {App_Language.startsWith("ar") ? "لا توجد مهارات" : "No skills"}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skills: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  skillTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginTop: 6,
  },
});
