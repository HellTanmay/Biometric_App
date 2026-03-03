import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EnrollmentScreen from "../screens/EnrollmentScreen";
import AttendanceScreen from "../screens/AttendanceScreen";

const Drawer = createDrawerNavigator();

export default function DashboardDrawer() {
    
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1E293B" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#1E293B",
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Enrollment"
        component={EnrollmentScreen}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person-add" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="log-in" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Check-Out"
        component={AttendanceScreen}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}