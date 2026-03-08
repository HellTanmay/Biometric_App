import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your PC IP
export const API_BASE_URL = "http://10.41.1.21:8000/api";
// export const API_BASE_URL = "https://d4f3-2402-3a80-4224-3c35-8d4d-fcad-b7dc-9d05.ngrok-free.app/api";
export const ENDPOINTS = {
    LOGIN: "/auth/login",
    SEND_OTP: "/auth/send-otp",
    RESEND_OTP: "/auth/resend-otp",
    VERIFY_OTP: "/auth/verify-otp",
    SET_MPIN: "/auth/set-mpin",

    // USERS
    GET_USERS: "/users",
    CREATE_USER: "/users",
    UPDATE_USER: "/users",
    DELETE_USER: "/users",
    RESTORE_USER: "/restore-user",
    FORCE_DELETE_USER: "/force-delete-user",
    GET_DELETED_USERS: "/deleted-users",
    GET_NOTENROLLED_USERS:"/users/notEnrolled",
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