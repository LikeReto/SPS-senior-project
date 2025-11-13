import { Modal, Pressable, View, Text, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { LANGUAGES } from "@/src/constants/languages";

export default function LanguageModal({ visible, onClose, App_Language, isDark, changeLanguage }) {


  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.modalSheet, { backgroundColor: isDark ? "#1a1a1a" : "#fff" }]}>
          <Text style={[styles.modalTitle, { color: isDark ? "#fff" : "#111" }]}>
            {App_Language?.startsWith("ar")
              ? "اختر اللغة"
              : "Select Language"
            }
          </Text>

          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.modalItem}
              onPress={() => {
                changeLanguage(lang.code);
                onClose();
              }}
            >
              <Text style={[styles.langText, { color: isDark ? "#fff" : "#111" }]}>
                {lang.flag} {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
