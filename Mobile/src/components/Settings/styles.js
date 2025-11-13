import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  topBar: {
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "800" },
  card: {
    marginHorizontal: 14,
    marginVertical: 6,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    // shadow for ios
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    // elevation for android
    elevation: 1,
  },
  label: { fontSize: 16, fontWeight: "600" },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  languageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e8fff3",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    padding: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  modalItem: { paddingVertical: 14 },
  langText: { fontSize: 16, fontWeight: "600" },


  // row that contains icon + label + right content
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // left icon wrapper
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  // right side container for toggle / badge / chevron
  rightContent: {
    marginLeft: 12,
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 24,
  },

});
