import axios, { isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const BASE_URL = ' https://9e74-2402-3a80-4469-2063-fd67-8b90-48d1-c56a.ngrok-free.app/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        console.log('API Client - Token Retrieved:', token ? 'Found (Starts with ' + token.substring(0, 10) + '....)' : 'Not Found');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const attendanceApi = {
    checkInAttendace: async (userId: string, base64Image: string, latitude: number, longitude: number) => {
        try {
            const response = await apiClient.post('/check-in', {
                user_id: userId,
                file: base64Image,
                latitude: latitude,
                longitude: longitude,
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                // console.error("API Error details:", error.response?.data || error.message);
                throw error;
            }
        }
    },
    checkOutAttendance: async (userId: string, base64Image: string, latitude: number, longitude: number) => {
        try{
            const response = await apiClient.post('/check-out', {
                user_id: userId,
                file: base64Image,
                latitude: latitude,
                longitude: longitude,
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                // console.error("API Error details:", error.response?.data || error.message);
                throw error;
            }
        }
    },

    enrollStaff: async (userId: string, base64Image: string) => {
        try {
            const response = await apiClient.post('/enroll', {
                user_id: userId,
                file: base64Image,
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("Enrollment Error:", error.response?.data || error.message);
                throw error;
            }
        }
    },
    getAttendanceStatus:async () => {
        try {
            const response = await apiClient.get('/check-status');
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error("Check Status Error:", error.response?.data || error.message);
                throw error;
            }
        }
    }

};