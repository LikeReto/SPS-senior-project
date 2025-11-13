import { Text } from "react-native";

export default function SectionTitle({ title, isDark }) {
  return (
    <Text
      style={{
        marginLeft: 18,
        marginTop: 25,
        marginBottom: 8,
        fontWeight: "700",
        fontSize: 15,
        color: isDark ? "#e5e5e5" : "#111",
        opacity: 0.8,
      }}
    >
      {title}
    </Text>
  );
}
