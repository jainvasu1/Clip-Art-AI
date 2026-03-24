import { useState, useEffect } from 'react';
import {StatusBar} from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0F" />
      {user ? (
        <HomeScreen />
      ) : (
        <LoginScreen onLoginSuccess={() => {}} />
      )}
    </>
  );
}