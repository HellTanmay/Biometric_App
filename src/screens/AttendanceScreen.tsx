import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function AttendanceScreen() {
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async () => {
        try {
            setLoading(true);

            // 1) Location permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Location permission is needed for attendance.');
                return;
            }

            // 2) Get current location
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const { latitude, longitude } = position.coords;
            console.log('Current location:', latitude, longitude);

            // 3) Check biometric availability
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert(
                    'Biometrics not available',
                    'This device does not have Face ID / biometric enrollment.'
                );
                return;
            }

            // 4) Trigger Face ID / biometric prompt
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Confirm your identity to mark attendance',
                fallbackLabel: 'Use device PIN'
            });

            if (!result.success) {
                Alert.alert('Authentication failed', 'Face ID / biometrics failed. Try again.');
                return;
            }

            // 5) Dummy success (later we call Laravel APIs here)
            Alert.alert(
                'Success',
                `Dummy check-in.\nLat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
            );
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong during attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biometric + Geofence Attendance</Text>
            <Text style={styles.subtitle}>Press the button to test location + Face ID flow.</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Mark Attendance" onPress={handleCheckIn} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    title: { fontSize: 20, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#555', marginBottom: 24, textAlign: 'center' }
});
