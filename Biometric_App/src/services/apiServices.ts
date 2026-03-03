import axios, { isAxiosError } from 'axios';

const BASE_URL = 'https://95bb-103-141-112-51.ngrok-free.app/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

export const attendanceApi = {
    verifyAttendance: async (userId: string, base64Image: string, latitude: number, longitude: number) => {
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
                console.error("API Error details:", error.response?.data || error.message);
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
    }
};