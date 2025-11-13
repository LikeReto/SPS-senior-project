import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { enableFreeze } from 'react-native-screens';
import 'react-native-gesture-handler';
import { AuthProvider } from '@/src/Contexts/AuthContext';
import { SocketProvider } from '@/src/Contexts/SocketContext';

// Enable Freeze for performance optimization
enableFreeze(true);

export default function RootLayout() {

  return (
    <AuthProvider>
      <SocketProvider>
        <StatusBar />
        <Stack screenOptions={{ headerShown: false, }} />
      </SocketProvider>
    </AuthProvider>
  );
}
