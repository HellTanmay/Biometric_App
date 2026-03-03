import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AttendanceScreen from './src/screens/AttendanceScreen';
import LoginScreen from './src/screens/LoginScreen';
import EnrollmentScreen from './src/screens/EnrollmentScreen';

export type RootStackParamList = {
    Attendance: undefined;
    Login: undefined;
    Enrollment: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Login' }}
                />
                <Stack.Screen
                    name="Enrollment"
                    component={EnrollmentScreen}
                    options={{ title: 'Face Enrollment' }}
                />
                <Stack.Screen
                    name="Attendance"
                    component={AttendanceScreen}
                    options={{ title: 'Biometric Attendance' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
