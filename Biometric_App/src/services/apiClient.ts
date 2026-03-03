import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your PC IP
export const API_BASE_URL = " https://aa72-2402-3a80-447a-25dd-d69-3307-f443-fbc9.ngrok-free.app/api";

export const ENDPOINTS = {
    LOGIN: "/login",
    SEND_OTP: "/send-otp",
    RESEND_OTP: "/resend-otp",
    VERIFY_OTP: "/verify-otp",
    SET_MPIN: "/set-mpin",

    // USERS
    GET_USERS: "/users",
    CREATE_USER: "/users",
    UPDATE_USER: "/users",
    DELETE_USER: "/users",
    RESTORE_USER: "/restore-user",
    FORCE_DELETE_USER: "/force-delete-user",
    GET_DELETED_USERS: "/deleted-users",

    // ROLES  CORRECTED
    GET_ROLES: "/roles",
    GET_DELETED_ROLES: "/deleted-roles",
    CREATE_ROLE: "/role",
    UPDATE_ROLE: "/roles",
    DELETE_ROLE: "/roles",
    RESTORE_ROLE: "/restore-role",
    FORCE_DELETE_ROLE: "/force-delete-role",

};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

// Automatically attach token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        console.log("Interceptor - Token:", token  ? "Found (Starts with " + token.substring(0, 10) + "....)" : "Not Found");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;