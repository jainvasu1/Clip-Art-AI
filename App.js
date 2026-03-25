import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#E8837A" />
      {loggedIn ? (
        <HomeScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
      )}
    </>
  );
}