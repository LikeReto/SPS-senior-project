// src/components/Reviews/UserReviews.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReviewsCarousel from "./Reviews/ReviewsCarousel";

export default function UserReviews({ userData, isDark, App_Language }) {
    const isArabic = App_Language.startsWith("ar");

    // 🌟 FAKE — Replace with backend data later
    const fakeReviews = userData?.User_Reviews.length > 0
        ? userData.User_Reviews
        : [
            {
                name: "Mohammed",
                stars: 5,
                date: "2025-11-22",
                avatar: "https://i.pravatar.cc/150?img=1",
                text: isArabic ? "عمل محترف جداً!" : "Super professional work!",
            },
            {
                name: "Sarah",
                stars: 4,
                date: "2025-11-20",
                avatar: "https://i.pravatar.cc/150?img=11",
                text: isArabic ? "أنصح بالتعامل معه بقوة" : "Highly recommended!",
            },
            {
                name: "Khalid",
                stars: 4.5,
                date: "2025-11-19",
                avatar: "https://i.pravatar.cc/150?img=15",
                text: isArabic
                    ? "تواصل ممتاز وتسليم سريع"
                    : "Great communication & fast delivery",
            },
            {
                name: "Aisha",
                stars: 4,
                date: "2025-11-17",
                avatar: "https://i.pravatar.cc/150?img=5",
                text: isArabic ? "الخدمة مناسبة جداً" : "Good service overall",
            },
        ];

    return (
        <View style={{ marginTop: 20 }}>
            <Text
                style={[
                    styles.title,
                    { color: isDark ? "#fff" : "#111", marginLeft: 20 },
                ]}
            >
                {isArabic ? "آخر التقييمات" : "Latest Reviews"}
            </Text>

            <ReviewsCarousel reviews={fakeReviews} isDark={isDark} />
        </View>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
});
