import axios from "axios";
import { useUserStore } from "../store/useUserStore";

const apiInstance = axios.create({
    baseURL: "https://api.kitek-pg.ru/api/marketplace/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

apiInstance.interceptors.request.use((config) => {
    const { session } = useUserStore.getState();

    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }

    return config;
});

const registerUser = async (user) => {
    const res = await apiInstance.post("/auth/register", user)
    useUserStore.getState().setSession(res.data)
    return res
}

const loginUser = async (user) => {
    const res = await apiInstance.post("/auth/login", user)
    useUserStore.getState().setSession(res.data);
    return res
}

async function getItems() {
    return (await apiInstance.get("/items")).data;
}

async function getItem(id) {
    return (await apiInstance.get(`/items/${id}`)).data;
}

async function getStats() {
    return (await apiInstance.get("/stats")).data;
}

async function getItemBids(id) {
    return (await apiInstance.get(`/items/${id}/bids`)).data;
}

async function getMyBids() {
    return (await apiInstance.get("/bids/my")).data;
}

async function sendItems(item) {
    return (await apiInstance.post("/items", item)).data;
}

async function deleteItems(id) {
    return (await apiInstance.delete(`/items/${id}`)).data;
}

async function createBid({ id, amount }) {
    return (await apiInstance.post(`/items/${id}/bids`, { amount })).data;
}

export const api = {
    registerUser,
    loginUser,
    getItems,
    getStats,
    getItemBids,
    getMyBids,
    sendItems,
    deleteItems,
    createBid,
    getItem
};
