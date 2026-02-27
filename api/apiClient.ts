import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your PC IP
export const API_BASE_URL = "https://2027-2402-3a80-1e14-3b46-5502-e2a0-512d-b5f3.ngrok-free.app/api";

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
    "Content-Type": "application/json",
  },
});

// Automatically attach token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;