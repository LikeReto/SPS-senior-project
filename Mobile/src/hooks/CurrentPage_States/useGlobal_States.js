import { create } from "zustand";

// Zustand store to manage the second user state
export const useUser2Store = create((set) => ({
    user2: null,
    setUser2: (user) => set({ user2: user }),
    clearUser2: () => set({ user2: null }),
}))