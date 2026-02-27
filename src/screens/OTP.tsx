import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { Block, Text, Input, Button } from "../components";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";


import { verifyOTP,resendOTP} from "../../api/Login";



const OTP = ({ navigation, route }: any) =>   {
  const { mobile ,otp:initialOtp} = route.params;

  const [otp, setOtp] = useState("");
  const [backendOtp, setBackendOtp] = useState(initialOtp||""); // For testing, remove in production



  
//verify function


  const handleVerifyOTP = async () => {
  if (!otp) {
    Alert.alert("Please enter OTP");
    return;
  }

  try {
    const response = await verifyOTP({
      mobile: mobile,
      otp: otp,
    });

    Alert.alert("Success", response.message || "OTP verified");

    navigation.navigate("SetMPIN", { mobile });

  } catch (error: any) {
    Alert.alert("Error", error.message || "Invalid OTP");
  }
};


//resend function
// const handleResendOTP = async () => {
//   try {
//     const response = await resendOTP({ mobile: mobile });


//     console.log("Resent from backend:", response.otp); // For testing, remove in production
//     Alert.alert("Success", response.message || "OTP resent");
//   } catch (error: any) {
//     Alert.alert("Error", error.message || "Failed to resend OTP");
//   }
// };

const handleResendOTP = async () => {
  try {
    const response = await resendOTP({ mobile });

    console.log("OTP from backend:", response.otp);

    //  Save OTP into state
    // if (response.otp) {
     
    // }
  setBackendOtp(response.otp);
    Alert.alert("Success", response.message || "OTP resent");

  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to resend OTP");
  }
};
 // return (
//     <LinearGradient
//       colors={["#4e73df", "#7b2ff7"]}
//       style={styles.gradient}
//     >
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <Block style={styles.card}>
//           <Text bold size={24} center>
//             OTP Verification
//           </Text>

//           <Text
//             size={14}
//             color="gray"
//             center
//             style={{ marginTop: 20, marginBottom: 20 }}
//           >
//             Enter the OTP sent to your mobile
//           </Text>



//           {/* OTP DISPLAY CARD */}
//           {backendOtp !== "" && (
//   <Block style={styles.otpCard}>
//     <Text semibold size={14}>
//       Demo OTP
//     </Text>

//     <Text bold size={22} style={{ marginTop: 5 }}>
//       {backendOtp}
//     </Text>
//   </Block>
// )}
          


//           {/* <Block style={styles.otpCard}>
//             <Text semibold size={16}>
//               OTP: {generatedOtp}
//             </Text>

//             <Block row align="center" marginTop={8}>
//               <MaterialIcons
//                 name="access-time"
//                 size={18}
//                 color={expired ? "#ff4d4f" : "#555"}
//                 style={{ marginRight: 5 }}
//               />
//               <Text size={13} color={expired ? "red" : "gray"}>
//                 {expired ? "OTP Expired" : `Expires in ${timer}s`}
//               </Text>
//             </Block> */}
//           </Block>

//           {/* OTP INPUT */}
//           <Text bold style={styles.label}>
//             Enter OTP
//           </Text>

//           <Input
//             placeholder="Enter 6 digit OTP"
//             keyboardType="numeric"
//             maxLength={6}
//             value={otp}
//             onChangeText={(text: string) => {
//               const cleaned = text.replace(/[^0-9]/g, "");
//               setOtp(cleaned);
//             }}
//           />

//           {/* VERIFY BUTTON */}
//          <Button
//   color="lightblue"
//   style={styles.button}
//   onPress={handleVerifyOTP}
// >
//             <Text bold color="black">
//               Verify OTP
//             </Text>
//           </Button>

//           <Text
//             center
//             color="primary"
//             style={{ marginTop: 15 }}
//             onPress={ handleResendOTP }
//           >
//             Resend OTP
//           </Text>

//           <Text
//             center
//             color="primary"
//             style={{ marginTop: 10 }}
//             onPress={() => navigation.navigate("Login")}
//           >
//             Back to Login
//           </Text>

    

//       </ScrollView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   scroll: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 25,
//     padding: 25,
//     elevation: 8,
//     marginTop: 180,
//     marginBottom: 250,
//   },
//   otpCard: {
//     backgroundColor: "#f5f7ff",
//     padding: 15,
//     borderRadius: 15,
//     marginBottom: 15,
//     alignItems: "center",
//     elevation: 4,
//   },
//   label: {
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   button: {
//     marginTop: 25,
//     borderRadius: 40,
//   },
// });

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
    marginTop: 130,
    marginBottom: 250,
  },
  
  label: {
    marginBottom: 8,
  },
 
  button: {
    borderRadius: 40,
    marginTop: 25,
  },
  otpCard: {
  backgroundColor: "#f5f7ff",
  padding: 20,
  borderRadius: 20,
  alignItems: "center",
  marginBottom: 20,
  elevation: 5,
},

otpTitle: {
  fontSize: 14,
  color: "#666",
},

otpNumber: {
  fontSize: 28,
  fontWeight: "bold",
  letterSpacing: 5,
  marginTop: 5,
},

otpInput: {


 

  textAlign: "center",
  fontSize: 20,
  letterSpacing: 5,
  backgroundColor: "#fff",

},
});
return (
  <LinearGradient
    colors={["#4e73df", "#7b2ff7"]}
    style={styles.gradient}
  >
    <ScrollView contentContainerStyle={styles.scroll}>
      




        

        {/* OTP DISPLAY CARD */}
       <Block style={styles.card}>

  <Text bold size={24} center>
    OTP Verification
  </Text>

  <Text
    size={14}
    color="gray"
    center
    style={{ marginTop: 20, marginBottom: 20 }}
  >
    Enter the OTP sent to your mobile
  </Text>

  {/* 👇 ADD HERE */}
  {backendOtp !== "" && (
    <Block style={styles.otpCard}>
    
      <Text style={styles.otpNumber}>{backendOtp}</Text>
    </Block>
  )}

  {/* OTP INPUT */}


            {/* <Block row align="center" marginTop={8}>
              <MaterialIcons
                name="access-time"
                size={16}
                color="#777"
                style={{ marginRight: 5 }}
              />
              <Text size={12} color="gray">
                Valid for 2 minutes
              </Text>
            </Block> */}
         
        

        {/* OTP INPUT */}
        <Text bold style={styles.label}>
          Enter OTP
        </Text>

        <Input
          placeholder="Enter 6 digit OTP"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          style={styles.otpInput}
          onChangeText={(text: string) => {
            const cleaned = text.replace(/[^0-9]/g, "");
            setOtp(cleaned);
          }}
       
        />

        {/* VERIFY BUTTON */}
        <Button
          color="lightblue"
          style={styles.button}
          onPress={handleVerifyOTP}
        >
          <Text bold color="black">
            Verify OTP
          </Text>
        </Button>

        {/* RESEND */}
        <Block center marginTop={20}>
          <Text size={14} color="gray">
            Didn’t receive OTP?
          </Text>

          <Text
            color="primary"
            semibold
            marginTop={5}
            onPress={handleResendOTP}
          >
            Resend OTP
          </Text>
        </Block>

        {/* BACK */}
        <Text
          center
          color="primary"
          style={{ marginTop: 25 }}
          onPress={() => navigation.navigate("Login")}
        >
          Back to Login
        </Text>

      </Block>
   
    </ScrollView>
  </LinearGradient>
);


}

export default OTP;