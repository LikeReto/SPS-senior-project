// src/components/Reviews/ReviewsCarousel.js
import React, { useRef, useEffect, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import ReviewCard from "./ReviewCard";

const { width } = Dimensions.get("window");

export default function ReviewsCarousel({ reviews, isDark }) {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      let next = index + 1;
      if (next >= reviews.length) next = 0;

      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  // Track scroll position
  const onScrollEnd = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / width);
    setIndex(newIndex);
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={reviews}
        keyExtractor={(_, i) => i.toString()}
        snapToInterval={width}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 20 }}>
            <ReviewCard item={item} isDark={isDark} />
          </View>
        )}
      />

      {/* Pagination */}
      <View style={styles.pagination}>
        {reviews.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? "#10b981" : "#999",
                opacity: i === index ? 1 : 0.4,
              },
            ]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 20,
  },
});
