import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Pro} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import Login from "../screens/Login";
import UserList from "../screens/UserList";
import ForgotMPIN from "../screens/ForgotMPIN";
import OTP from "../screens/OTP";
import SetMPIN from "../screens/SetMPIN";
import AdminPanel from "../screens/AdminPanel";
import Roles from "../screens/Roles";



const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    
//    <Stack.Navigator 
//   initialRouteName="Login"
//   screenOptions={screenOptions.stack}
// >
// <Stack.Screen name="ForgotMPIN" component={ForgotMPIN} />

//       <Stack.Screen name="Login" component={Login} />
// <Stack.Screen name="UserList" component={UserList} />
// <Stack.Screen name="OTP" component={OTP} />
// <Stack.Screen name="SetMPIN" component={SetMPIN} />



//       <Stack.Screen
//         name="Home"
//         component={Home}
//         options={{title: t('navigation.home')}}
//       />

//       <Stack.Screen
//         name="Components"
//         component={Components}
//         options={screenOptions.components}
//       />

//       <Stack.Screen
//         name="Articles"
//         component={Articles}
//         options={{title: t('navigation.articles')}}
//       />

//       <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

//       <Stack.Screen
//         name="Profile"
//         component={Profile}
//         options={{headerShown: false}}
//       />

//       <Stack.Screen
//         name="Register"
//         component={Register}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen name="AdminPanel" component={AdminPanel} />

//       <Stack.Screen name="Roles" component={Roles} />

//     </Stack.Navigator>


<Stack.Navigator
  initialRouteName="Login"
  screenOptions={screenOptions.stack}
>

  {/*  AUTH SCREENS (NO HEADER) */}
  <Stack.Screen
    name="Login"
    component={Login}
    options={{ headerShown: false }}
  />

  <Stack.Screen
    name="ForgotMPIN"
    component={ForgotMPIN}
    options={{ headerShown: false }}
  />

  <Stack.Screen
    name="OTP"
    component={OTP}
    options={{ headerShown: false }}
  />

  <Stack.Screen
    name="SetMPIN"
    component={SetMPIN}
    options={{ headerShown: false }}
  />

  {/* MAIN SCREENS (HEADER VISIBLE) */}
  <Stack.Screen name="AdminPanel" component={AdminPanel} />
  <Stack.Screen name="UserList" component={UserList} />
  <Stack.Screen name="Roles" component={Roles} />

  <Stack.Screen
    name="Home"
    component={Home}
    options={{ title: t('navigation.home') }}
  />

  <Stack.Screen
    name="Components"
    component={Components}
    options={screenOptions.components}
  />

  <Stack.Screen
    name="Articles"
    component={Articles}
    options={{ title: t('navigation.articles') }}
  />

  <Stack.Screen name="Pro" component={Pro} options={screenOptions.pro} />

  <Stack.Screen
    name="Profile"
    component={Profile}
    options={{ headerShown: false }}
  />

  <Stack.Screen
    name="Register"
    component={Register}
    options={{ headerShown: false }}
  />

</Stack.Navigator>


  );
};
