import axios, { isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const BASE_URL = 'https://da25-2402-3a80-1e14-cb78-e990-3da-4260-b7d9.ngrok-free.app/api';

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
           const formData = new FormData();

            formData.append("file", {
                uri: base64Image,
                name: "face.jpg",
                type: "image/jpeg",
            } as any);
            //@ts-ignore
            formData.append("latitude", latitude);
            //@ts-ignore
            formData.append("longitude", longitude);
            const response = await apiClient.post('/check-in', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
            const formData = new FormData();
            console.log('hit checkout')
            formData.append("file", {
                uri: base64Image,
                name: "face.jpg",
                type: "image/jpeg",
            } as any);
            //@ts-ignore
            formData.append("latitude", latitude);
            //@ts-ignore
            formData.append("longitude", longitude);
            console.log('hit formdata sending')
            const response = await apiClient.post('/check-out', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('return data')
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) {
                // console.error("API Error details:", error.response?.data || error.message);
                throw error;
            }
        }
    },

    enrollStaff: async (userId: string, photo: string) => {
        try {
            const formData = new FormData();

            formData.append("file", {
                uri: photo,
                name: "face.jpg",
                type: "image/jpeg",
            } as any);
            const response = await apiClient.post('/enroll', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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