import { create } from "zustand";

// Zustand store to manage the second user state (Profile Screen)
export const useUser2Store = create((set) => ({
    user2: null,
    setUser2: (user) => set({ user2: user }),
    clearUser2: () => set({ user2: null }),
}))

// Zustand store to manage the second user state (Chat Screen)
export const useChatUser2Store = create((set) => ({
    chatUser2: null,
    setChatUser2: (user) => set({ chatUser2: user }),
    clearChatUser2: () => set({ chatUser2: null }),
}))