import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import StyleSelectScreen from './src/screens/StyleSelectScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultScreen from './src/screens/ResultScreen';
import { generateAllStyles } from './src/services/aiService';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [results, setResults] = useState({});
  const [generateParams, setGenerateParams] = useState(null);

  const handleGenerate = async ({ imageBase64, customPrompt, intensity }) => {
    setResults({});
    setGenerateParams({ imageBase64, customPrompt, intensity });
    setScreen('results');

    await generateAllStyles({
      imageBase64,
      selectedStyles,
      customPrompt,
      intensity,
      onStyleComplete: (styleId, result) => {
        setResults(prev => ({ ...prev, [styleId]: result }));
      },
    });
  };

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
        <HomeScreen
          selectedStyles={selectedStyles}
          onBack={() => setScreen('styleSelect')}
          onGenerate={handleGenerate}
        />
      )}

      {screen === 'results' && (
        <ResultScreen
          results={results}
          selectedStyles={selectedStyles}
          onBack={() => setScreen('home')}
          onRegenerate={() => {
            if (generateParams) handleGenerate(generateParams);
          }}
        />
      )}
    </>
  );
}