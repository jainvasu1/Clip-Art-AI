import React from 'react';
import { StatusBar } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      <HomeScreen />
    </>
  );
}