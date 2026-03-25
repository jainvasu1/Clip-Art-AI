import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import StyleSelectScreen from './src/screens/StyleSelectScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [screen, setScreen] = useState('login'); // login | styleSelect | home
  const [selectedStyles, setSelectedStyles] = useState([]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      {screen === 'login' && (
        <LoginScreen onLoginSuccess={() => setScreen('styleSelect')} />
      )}
      {screen === 'styleSelect' && (
        <StyleSelectScreen
          onStylesSelected={(styles) => {
            setSelectedStyles(styles);
            setScreen('home');
          }}
        />
      )}
      {screen === 'home' && (
        <HomeScreen selectedStyles={selectedStyles} />
      )}
    </>
  );
}