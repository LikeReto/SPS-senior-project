import { memo } from 'react';
import { MotiView } from 'moti';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingIndicator = memo(function LoadingIndicator({ size = 70 }) {
  return (
    <MotiView
      from={styles.motiView(size, 0)}
      animate={styles.motiView(size + 20, 1)}
      transition={{
        type: 'timing',
        duration: 1000,
        loop: true,
      }}
      style={styles.indicator(size)}
    />
  );
});

const Loading = ({ isDeletingAccount = false }) => {
  return (
    <SafeAreaView style={styles.container(isDeletingAccount)}>
      <LoadingIndicator size={70} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: (isDeletingAccount) => ({
    flex: 1,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDeletingAccount ? 'transparent' : '#0F0F0F',
  }),

  motiView: (size, opacity) => ({
    opacity,
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: size / 10,
    shadowOpacity: opacity ? 1 : 0.5,
  }),

  indicator: (size) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: size / 10,
    borderColor: '#ffffff',
    shadowColor: '#ffffff',
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  }),
});

export default memo(Loading);
