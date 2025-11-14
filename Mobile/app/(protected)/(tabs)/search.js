import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import WorkerListCard from "@/src/components/WorkerListCard";
import { useAuth } from "@/src/Contexts/AuthContext";
import workers from "@/src/data/workers";

import * as Animatable from "react-native-animatable";


// Distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function Search() {
    const { Expo_Router, darkMode, location } = useAuth();

    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("nearest");

    // Workers with distance
    const workersWithDistance = useMemo(() => {
        let w = workers.map((worker) => ({
            ...worker,
            distance: location
                ? getDistance(location.latitude, location.longitude, worker.latitude, worker.longitude)
                : null,
        }));

        if (query) {
            w = w.filter(
                (worker) =>
                    worker.User_Name.toLowerCase().includes(query.toLowerCase()) ||
                    worker.User_Job.toLowerCase().includes(query.toLowerCase())
            );
        } else {
            // top 50 nearest or top-rated
            if (sortBy === "nearest") w.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            else if (sortBy === "top") w.sort((a, b) => b.rating - a.rating);
            w = w.slice(0, 50);
        }

        return w;
    }, [query, sortBy, location]);

    const topSuggestions = useMemo(() => {
        if (query) return [];
        let s = [...workersWithDistance].slice(0, 10);
        return s;
    }, [workersWithDistance, query]);

    return (
        <View style={[styles.container, { backgroundColor: darkMode === 'light' ? "#f5f5f5" : "#0a0a0a" }]}
            >
            {/* Search bar */}
            <View style={styles.header}>
                <Animatable.View
                    animation="bounceIn"
                    duration={500}
                    easing="ease-out"
                    style={styles.backButtonContainer}
                >
                    <TouchableOpacity
                        onPress={() => Expo_Router.back()}
                        activeOpacity={0.7}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={darkMode === 'light' ? "#111" : "white"} />
                    </TouchableOpacity>
                </Animatable.View>

                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search workers..."
                    placeholderTextColor={darkMode === 'light' ? "#888" : "#aaa"}
                    style={[
                        styles.searchInput,
                        { backgroundColor: darkMode === 'light' ? "#fff" : "#1f1f1f", color: darkMode === 'light' ? "#111" : "white" },
                    ]}
                />

                <TouchableOpacity onPress={() => setQuery("")} style={styles.clearButton}>
                    <Ionicons name="close" size={20} color={darkMode === 'light' ? "#111" : "white"} />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                <TouchableOpacity
                    onPress={() => setSortBy("nearest")}
                    style={[
                        styles.filterButton,
                        { backgroundColor: sortBy === "nearest" ? "#10b981" : darkMode === 'light' ? "#e6f9f0" : "#1f1f1f" },
                    ]}
                >
                    <Text style={{ color: sortBy === "nearest" ? "#fff" : darkMode === 'light' ? "#111" : "white" }}>Nearest</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSortBy("top")}
                    style={[
                        styles.filterButton,
                        { backgroundColor: sortBy === "top" ? "#10b981" : darkMode === 'light' ? "#e6f9f0" : "#1f1f1f" },
                    ]}
                >
                    <Text style={{ color: sortBy === "top" ? "#fff" : darkMode === 'light' ? "#111" : "white" }}>Top Rated</Text>
                </TouchableOpacity>
            </View>

            {/* Entire content scrollable */}
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Vertical workers list */}
                {workersWithDistance.map((worker) => (
                    <WorkerListCard
                        key={worker.id}
                        worker={worker}
                        onPress={() => Expo_Router.push(`/worker/${worker.id}`)}
                        isDark={darkMode === 'light' ? false : true}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        margin: 16,
        alignItems: "center"
    },
    backButtonContainer: {
        marginRight: 8,
        borderRadius: 12,
        overflow: "hidden",
    },

    backButton: {
        padding: 8,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    searchInput: {
        flex: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16
    },
    clearButton: {
        marginLeft: 8
    },
    filters: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 10
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center"
    },
});
