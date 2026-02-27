import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Block, Text, Input, Button } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { setMPIN } from "../../api/Login";


const SetMPIN = ({ navigation ,route}: any) => {
  const { mobile } = route.params;



  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");

  const handleSave = async () => {
  if (mpin.length !== 4 && mpin.length !== 6) {
    Alert.alert("MPIN must be 4 or 6 digits");
    return;
  }

  if (mpin !== confirmMpin) {
    Alert.alert("MPIN does not match");
    return;
  }

  try {
    const response = await setMPIN({
      mobile: mobile,
      mpin: mpin,
    });

    Alert.alert("Success", response.message || "MPIN updated successfully");

    navigation.navigate("Login");

  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to update MPIN");
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
            Set New MPIN
          </Text>

          <Text
            size={14}
            color="gray"
            center
            style={{ marginBottom: 20 }}
          >
            Enter and confirm your new MPIN
          </Text>

          <Text bold style={styles.label}>
            New MPIN
          </Text>

          <Input
  placeholder="Enter new MPIN"
  secureTextEntry
  keyboardType="numeric"
  maxLength={6}
  value={mpin}
  onChangeText={(text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setMpin(cleaned);
  }}
/>

          <Text bold style={styles.label}>
            Confirm MPIN
          </Text>

  <Input
  placeholder="Confirm MPIN"
  secureTextEntry
  keyboardType="numeric"
  maxLength={6}
  value={confirmMpin}
  onChangeText={(text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setConfirmMpin(cleaned);
  }}
/>


          <Button
            color="lightblue"
            style={styles.button}
            onPress={handleSave}
          >
            <Text bold color="black">
              Save MPIN
            </Text>
          </Button>

          <Text
            center
            color="primary"
            style={{ marginTop: 15 }}
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
    marginTop: 25,
    borderRadius: 40,
  },
});

export default SetMPIN;
