import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AttendanceScreen from './src/screens/AttendanceScreen';

export type RootStackParamList = {
    Attendance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Attendance"
                    component={AttendanceScreen}
                    options={{ title: 'Biometric Attendance' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
