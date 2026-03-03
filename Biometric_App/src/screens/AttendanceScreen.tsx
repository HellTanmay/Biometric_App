import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { attendanceApi } from '../services/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendanceScreen() {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<any>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await requestCameraPermission();
            await Location.requestForegroundPermissionsAsync();
        })();
    }, []);

    const handleVerifyAndClockIn = async () => {
        if (loading) return;

        try {
            setLoading(true);

            // 1. Get User ID from AsyncStorage
            const userDataString = await AsyncStorage.getItem("user");
            const user = userDataString ? JSON.parse(userDataString) : null;

            if (!user || !user?.id) {
                Alert.alert("Error", "User session not found. Please login again.");
                router.replace("/login");
                return;
            }

            // 2. Geolocation 
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location is required for hospital verification.");
                setLoading(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });

            // 3. Face Capture
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                    base64: true,
                });

                try {
                    // 4. API Call to Laravel -> FastAPI
                    const response = await attendanceApi.verifyAttendance(
                        user.id,
                        photo.base64!,
                        location.coords.latitude,
                        location.coords.longitude
                    );

                    // 5. Handle Logic
                    if (response.status === 'match' || response.status === 'success') {
                        Alert.alert("Success", "Attendance marked successfully!");
                    } else {
                        Alert.alert("Verification Failed", response.message || "Face did not match records.");
                    }
                } catch (error) {
                    console.error("Verification API Error:", error);
                    const serverMsg = error.response?.data?.message || "Could not verify attendance.";
                    Alert.alert("Server Error", serverMsg);
                }

            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    // Permission Screen
    if (!cameraPermission?.granted) {
        return (
            <SafeAreaView style={styles.centered}>
                <Text style={{ marginBottom: 20 }}>Camera access is required for Face ID.</Text>
                <TouchableOpacity style={styles.captureBtn} onPress={requestCameraPermission}>
                    <Text style={styles.btnText}>Enable Camera</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraWrapper}>
                {/* CameraView as a self-closing tag to avoid children warning */}
                <CameraView style={styles.camera} facing="front" ref={cameraRef} />

                {/* Overlay positioned absolutely over the camera */}
                <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="none">
                    <View style={styles.faceFrame} />
                </View>
            </View>

            <View style={styles.footer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" />
                ) : (
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.captureBtn}
                            onPress={handleVerifyAndClockIn}
                        >
                            <Text style={styles.btnText}>Verify & Clock In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.skipBtn}
                            onPress={() => {
                                Alert.alert(
                                    "Confirm Skip",
                                    "Are you sure you want to skip attendance? This will be logged.",
                                    [
                                        { text: "Cancel", style: "cancel" },
                                        { text: "Skip", onPress: () => router.replace("/dashboard") }
                                    ]
                                );
                            }}
                        >
                            <Text style={styles.skipText}>Continue Without Attendance</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cameraWrapper: {
        flex: 3,
        margin: 15,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#000'
    },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    faceFrame: {
        width: 220, height: 300, borderWidth: 3,
        borderColor: '#007AFF', borderRadius: 100, borderStyle: 'dashed'
    },
    footer: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    buttonGroup: { width: '100%', alignItems: 'center' },
    captureBtn: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        width: '80%',
        borderRadius: 35,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    skipBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    skipText: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
});