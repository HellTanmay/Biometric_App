// api/login.ts

import apiClient, { ENDPOINTS } from "./apiClient";

// LOGIN
export async function loginUser(data: any) {
  try {
    const response = await apiClient.post(ENDPOINTS.LOGIN, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
 
}



// SEND OTP
export async function sendOTP(data: any) {
  try {
    const response = await apiClient.post(ENDPOINTS.SEND_OTP, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Send OTP failed" };
  }
}

// VERIFY OTP
export async function verifyOTP(data: any) {
  try {
    const response = await apiClient.post(ENDPOINTS.VERIFY_OTP, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Verify OTP failed" };
  }
}

// SET MPIN
export async function setMPIN(data: any) {
  try {
    const response = await apiClient.post(ENDPOINTS.SET_MPIN, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Set MPIN failed" };
  }
}


// RESEND OTP



export async function resendOTP(data: any) {
  try {
    const response = await apiClient.post(ENDPOINTS.RESEND_OTP, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to resend OTP" };
  }
}
