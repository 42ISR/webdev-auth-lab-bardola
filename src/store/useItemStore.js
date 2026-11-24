import { create } from "zustand";
import { api } from "../api/api";

export const useItemStore = create((set) => ({
    items: [],
    getItems: async () => {
        const items = await api.getItems()
        set({ items: items })
    }
}))
