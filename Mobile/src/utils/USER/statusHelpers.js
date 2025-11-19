// ⭐ Status color helper
export const getStatusColor = (userStatus) => {
    switch (userStatus) {
        case "online": return "#10b981";
        case "busy":
        case "away": return "#FFAA00";
        case "do not disturb": return "#FF0000";
        default: return "#888";
    }
};

// ⭐ Translate Status
export const getStatusLabel = ({ userOnline, liveStatus, App_Language }) => {
    if (!userOnline) return App_Language.startsWith("ar") ? "غير متصل" : "Offline";

    switch (liveStatus) {
        case "online":
            return App_Language.startsWith("ar") ? "متصل" : "Online";
        case "busy":
            return App_Language.startsWith("ar") ? "مشغول" : "Busy";
        case "away":
            return App_Language.startsWith("ar") ? "بعيد" : "Away";
        case "do not disturb":
            return App_Language.startsWith("ar") ? "عدم الإزعاج" : "Do Not Disturb";
        default:
            return App_Language.startsWith("ar") ? "غير متصل" : "Offline";
    }
};