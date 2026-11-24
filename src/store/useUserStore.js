import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create()(
    persist(
        (set) => ({
            session: undefined,
            setSession: (newSession) => set({ session: newSession }),
            clearSession: () => set({ session: undefined }),
        }),
        {
            name: "session",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
