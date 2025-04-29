import axios from "axios";

const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {},
});

export default axiosInstance;
