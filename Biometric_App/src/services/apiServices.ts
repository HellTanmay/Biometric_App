import axios from 'axios';

const BASE_URL = 'https://ea57-103-141-112-51.ngrok-free.app/api';

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
                image: base64Image,
                lat: latitude,
                lng: longitude,
            });
            return response.data;
        } catch (error) {
            console.error("API Error details:", error.response?.data || error.message);
            throw error;
        }
    },

    enrollStaff: async (userId: string, base64Image: string) => {
        try {
            const response = await apiClient.post('/staff/enroll', {
                user_id: userId,
                image: base64Image,
            });
            return response.data;
        } catch (error) {
            console.error("Enrollment Error:", error.response?.data || error.message);
            throw error;
        }
    }
};