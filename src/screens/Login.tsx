import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Block, Text, Input, Button } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../../api/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }: any) => {
  const [mobile, setMobile] = useState("");
  const [mpin, setMpin] = useState("");

  const [mobileError, setMobileError] = useState("");
  const [mpinError, setMpinError] = useState("");

 const handleLogin = async () => {
  try {

    console.log("sending data:",{mobile: mobile, mpin: mpin});


    const response = await loginUser({
      mobile: mobile,
      mpin: mpin,
    });

    console.log("API response :", response);



    // Store token if backend returns token
    if (response.token) {
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user",JSON.stringify(response.user));
    }

    navigation.replace("AdminPanel");

  } catch (error: any) {
    console.log("Login error:", error);
    Alert.alert("Error", error.message);
  }
};
  return (
    <LinearGradient
      colors={["#4e73df", "#7b2ff7"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <Block style={styles.card}>
          {/* TITLE */}
          <Text bold size={24} center>
            Welcome Back
          </Text>

          <Text
            size={14}
            color="gray"
            center
            style={{ marginBottom: 20 }}
          >
            Login to your account
          </Text>

          {/* MOBILE */}
          <Text bold style={styles.label}>
            Mobile Number
          </Text>

          <Input
            placeholder="Enter your mobile number"
            keyboardType="numeric"
            maxLength={10}
            value={mobile}
            onChangeText={(text: string) => {
              const cleaned = text.replace(/[^0-9]/g, "");
              setMobile(cleaned);
            }}
          />

          {mobileError !== "" && (
            <Text size={12} color="red" style={styles.errorText}>
              {mobileError}
            </Text>
          )}

          {/* MPIN */}
          <Text bold style={styles.label}>
            MPIN
          </Text>

          <Input
            placeholder="Enter MPIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={mpin}
            onChangeText={(text: string) => {
              const cleaned = text.replace(/[^0-9]/g, "");
              setMpin(cleaned);
            }}
          />

          {mpinError !== "" && (
            <Text size={12} color="red" style={styles.errorText}>
              {mpinError}
            </Text>
          )}

          {/* FORGOT MPIN */}
          <Text
            size={14}
            color="primary"
            style={{ marginTop: 10, textAlign: "right" }}
            onPress={() => navigation.navigate("ForgotMPIN")}
          >
            Forgot MPIN?
          </Text>

          {/* LOGIN BUTTON */}
          <Button
            color="lightblue"
            style={styles.button}
            onPress={handleLogin}
          >
            <Text bold color="black">
              LOGIN
            </Text>
          </Button>
        </Block>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 6,
    marginTop: 180,
    marginBottom: 250,
  },
  label: {
    marginBottom: 5,
    marginTop: 15,
  },
  button: {
    borderRadius: 35,
    marginTop: 25,
  },
  errorText: {
    marginTop: 5,
  },
});

export default Login;