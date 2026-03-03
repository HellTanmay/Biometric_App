import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, CameraCapturedPicture } from 'expo-camera';
import { Block, Text, Button } from '../../components'; 
import { attendanceApi } from '../services/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EnrollmentScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<CameraView>(null);

    const handleCaptureAndEnroll = async () => {
        if (!cameraRef.current) return;

        try {
            setLoading(true);

            // 1. Capture the image (base64 is required for your API)
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.4, 
            });

            // 2. Retrieve the stored User ID from Login
            const userDataString = await AsyncStorage.getItem("user");
            const user = userDataString ? JSON.parse(userDataString) : null;
            const userId = user?.id;

            if (!userId) {
                Alert.alert("Error", "User session not found. Please login again.");
                navigation.replace("Login");
                return;
            }

            // 3. Call the API (Ensure you use the 'file' key as your backend expects)
            console.log("Enrolling user:", userId);
            await attendanceApi.enrollStaff(userId, photo.base64 || "");

            Alert.alert("Success", "Face enrollment complete!", [
                { text: "Continue", onPress: () => navigation.replace("Attendance") }
            ]);

        } catch (error: any) {
            console.error("Enrollment failed:", error);
            const errorMsg = error.response?.data?.message || "Could not process enrollment.";
            Alert.alert("Enrollment Error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Block flex={1} white>
            <Block padding={20} center justify='center'>
                <Text bold size={24} marginBottom={10}>Face Enrollment</Text>
                <Text color="gray" center>Position your face in the center of the frame</Text>
            </Block>

            <View style={styles.cameraContainer}>
                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing="front"
                />
                {/* The Overlay Circle to help user positioning */}
                <View style={styles.overlay} />
            </View>

            <Block padding={30} center>
                {loading ? (
                    <ActivityIndicator size="large" color="#4e73df" />
                ) : (
                    <Button
                        color="primary"
                        onPress={handleCaptureAndEnroll}
                        style={styles.captureBtn}
                    >
                        <Ionicons name="camera" size={24} color="black" />
                        <Text bold color="black" marginLeft={10}>CAPTURE & ENROLL</Text>
                    </Button>
                )}
            </Block>
        </Block>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 2,
        marginHorizontal: 20,
        borderRadius: 200, // Makes the container look circular
        overflow: 'hidden',
        borderWidth: 5,
        borderColor: '#4e73df',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 40,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 200,
    },
    captureBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
        borderRadius: 30,
    }
});

export default EnrollmentScreen;