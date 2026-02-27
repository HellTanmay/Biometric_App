import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Block, Text, Input, Button } from "../components";
import { LinearGradient } from "expo-linear-gradient";


import { sendOTP } from "../../api/Login";


const ForgotMPIN = ({ navigation }: any) => {
  const [mobile, setMobile] = useState("");



 //const [error, setError] = useState("");

  const handleSendOTP = async () => {

  // ✅ Frontend validation (UI level)
  if (!mobile || mobile.length !== 10) {
    Alert.alert("Enter valid 10 digit mobile number");
    return;
  }

  try {
    console.log("Sending OTP for:", mobile);

    const response = await sendOTP({
      mobile: mobile,
    });


    console.log("otp from backend:", response.otp); // For testing, remove in production
    console.log("Send OTP response:", response);

    Alert.alert("Success", response.message || "OTP sent");

    navigation.navigate("OTP", { mobile ,otp:response.otp}); // Pass OTP for testing, remove in production

  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to send OTP");
  }
};

  return (
    <LinearGradient
      colors={["#4e73df", "#7b2ff7"]}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Block style={styles.card}>
          <Text bold size={24} center>
            Forgot MPIN
          </Text>

          <Text
            size={14}
            color="gray"
            center
            style={{ marginBottom: 20 }}
          >
            Enter your registered mobile number to receive OTP
          </Text>

          <Text bold style={styles.label}>
            Registered Mobile Number
          </Text>

          <Input
            placeholder="Enter mobile number"
            keyboardType="numeric"
            maxLength={10}
            value={mobile}
            onChangeText={(text: string) => {
              const cleaned = text.replace(/[^0-9]/g, "");
              setMobile(cleaned);
            }}
          />

          {/* {error !== "" && (
            <Text size={12} color="red" style={{ marginTop: 5 }}>
              {error}
            </Text>
          )} */}

          <Button
            color="lightblue"
            style={styles.button}
            onPress={handleSendOTP}
          >
            <Text bold color="black">
              Send OTP
            </Text>
          </Button>

          <Text
            color="primary"
            center
            style={{ marginTop: 20 }}
            onPress={() => navigation.navigate("Login")}
          >
            Back to Login
          </Text>
        </Block>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 8,
    marginTop: 180,
    marginBottom: 250,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
  },
  button: {
    borderRadius: 35,
    marginTop: 20,
  },
});

export default ForgotMPIN;