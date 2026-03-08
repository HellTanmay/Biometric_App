import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraCapturedPicture } from "expo-camera";
import { Block, Text, Button } from "../../components";
import { attendanceApi } from "../services/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { notEnrolled } from "../services/User";

const EnrollmentScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

useEffect(() => {
    fetchUsers();
}, []);

  const fetchUsers = async () => {
    try {
      const res = await notEnrolled();
      setUsers(res);
    } catch (error) {
      Alert.alert("Error", "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCaptureAndEnroll = async () => {
    if (!cameraRef.current || !selectedUser) {
      Alert.alert("Select User", "Please select a user first");
      return;
    }

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        skipProcessing: true,
        shutterSound: false,
      });

      console.log("Enrolling user:", selectedUser.id);

      await attendanceApi.enrollStaff(selectedUser.id, photo.uri || "");

      Alert.alert("Success", `${selectedUser.name} enrolled successfully`);

      setSelectedUser(null);
      fetchUsers(); // refresh list
    } catch (error: any) {
      Alert.alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Block flex={1} white>
      <Block padding={20} center justify="center">
        <Text bold size={18} marginBottom={10} center>
          Select a User for Enrollment
        </Text>
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={users}
            search
            maxHeight={300}
            labelField="name"
            valueField="id"
            placeholder="Select User"
            searchPlaceholder="Search user..."
            value={selectedUser?.id}
            onChange={(item) => {
              setSelectedUser(item);
            }}
          />
        </View>
      </Block>
        {selectedUser&&(<>    
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          pictureSize="640x480"
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
            <Text bold color="black" marginLeft={10}>
              CAPTURE & ENROLL
            </Text>
          </Button>
        )}
      </Block></>)}
    </Block>
    
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 2,
    marginHorizontal: 20,
    borderRadius: 200, // Makes the container look circular
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#4e73df",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 40,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 200,
  },
  captureBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default EnrollmentScreen;
