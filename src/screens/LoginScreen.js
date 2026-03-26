import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, TextInput, KeyboardAvoidingView,
  Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export default function LoginScreen({ onLoginSuccess }) {
  const [screen, setScreen] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Email/Password Auth
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      if (screen === 'signin') {
        await auth().signInWithEmailAndPassword(email, password);
      } else {
        await auth().createUserWithEmailAndPassword(email, password);
        if (name) {
          await auth().currentUser.updateProfile({ displayName: name });
        }
      }
      onLoginSuccess();
    } catch (error) {
      let msg = 'Something went wrong';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already in use';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address';
      if (error.code === 'auth/wrong-password') msg = 'Wrong password';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email';
      if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // Google Auth
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
      onLoginSuccess();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Sign in already in progress');
      } else {
        Alert.alert('Error', 'Google Sign-In failed. Try again.');
        console.log('Google error:', error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── WELCOME SCREEN ───────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeTop}>
            <View style={styles.decor1} />
            <View style={styles.decor2} />
            <View style={styles.decor3} />
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🎨</Text>
              </View>
              <Text style={styles.appName}>CLIPART AI</Text>
              <Text style={styles.appTagline}>Powered by AI</Text>
            </View>
          </View>

          <View style={styles.welcomeBottom}>
            <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Transform your photos into stunning clipart with the power of AI
            </Text>

            <View style={styles.bulletList}>
              {[
                { icon: '🎨', text: 'Cartoon, Anime, Pixel & Sketch styles' },
                { icon: '⚡', text: 'Generate all styles in seconds' },
                { icon: '💾', text: 'Download & share your creations' },
                { icon: '🔒', text: 'Secure & private' },
              ].map((item, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bulletIconBox}>
                    <Text style={styles.bulletIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.bulletText}>{item.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => setScreen('signin')}
              activeOpacity={0.85}>
              <Text style={styles.continueBtnText}>Get Started  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── SIGN IN / SIGN UP SCREEN ─────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">

          <View style={styles.authTop}>
            <View style={styles.decor1} />
            <View style={styles.decor2} />
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setScreen('welcome')}>
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <View style={[styles.logoCircle, { width: 52, height: 52, borderRadius: 26 }]}>
                <Text style={[styles.logoEmoji, { fontSize: 24 }]}>🎨</Text>
              </View>
              <Text style={styles.appName}>CLIPART AI</Text>
            </View>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.authTitle}>
              {screen === 'signin' ? 'Sign In' : 'Sign Up'}
            </Text>
            <View style={styles.titleUnderline} />

            {screen === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#BBB"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="demo@email.com"
                  placeholderTextColor="#BBB"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputBox}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#BBB"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {screen === 'signin' && (
              <View style={styles.rememberRow}>
                <TouchableOpacity
                  style={styles.rememberLeft}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Remember Me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={styles.authBtn}
              onPress={handleAuth}
              activeOpacity={0.85}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.authBtnText}>
                  {screen === 'signin' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
              disabled={googleLoading}>
              {googleLoading ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <View style={styles.googleIconBox}>
                    <Text style={styles.googleIconText}>G</Text>
                  </View>
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchBtn}
              onPress={() => setScreen(screen === 'signin' ? 'signup' : 'signin')}>
              <Text style={styles.switchText}>
                {screen === 'signin'
                  ? "Don't have an account?  "
                  : 'Already have an account?  '}
                <Text style={styles.switchLink}>
                  {screen === 'signin' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const PINK = '#E8837A';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PINK },
  welcomeContainer: { flex: 1 },
  welcomeTop: {
    height: 360, backgroundColor: PINK,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  welcomeBottom: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    marginTop: -40, padding: 28, paddingTop: 32,
  },
  logoContainer: { alignItems: 'center', gap: 10 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  logoEmoji: { fontSize: 32 },
  appName: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  appTagline: { fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 14, color: '#888', lineHeight: 22, marginBottom: 24 },
  bulletList: { gap: 12, marginBottom: 28 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bulletIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#FFF0EF',
    alignItems: 'center', justifyContent: 'center',
  },
  bulletIcon: { fontSize: 18 },
  bulletText: { fontSize: 14, color: '#444', fontWeight: '500', flex: 1 },
  continueBtn: {
    backgroundColor: PINK, borderRadius: 50,
    paddingVertical: 16, alignItems: 'center',
    elevation: 4, shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  authTop: {
    height: 200, backgroundColor: PINK,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  authCard: {
    flex: 1, backgroundColor: '#fff',
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    marginTop: -40, padding: 28, paddingTop: 32,
  },
  backBtn: { position: 'absolute', top: 20, left: 20 },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  authTitle: { fontSize: 30, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  titleUnderline: {
    width: 40, height: 3, backgroundColor: PINK,
    borderRadius: 2, marginBottom: 24,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1.5, borderBottomColor: '#E8E8E8',
    paddingBottom: 8, gap: 8,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', paddingVertical: 2 },
  rememberRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: PINK, borderColor: PINK },
  checkboxTick: { color: '#fff', fontSize: 11, fontWeight: '900' },
  rememberText: { fontSize: 13, color: '#555', fontWeight: '500' },
  forgotText: { color: PINK, fontSize: 13, fontWeight: '600' },
  authBtn: {
    backgroundColor: PINK, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    marginTop: 4, elevation: 4,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8,
  },
  authBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20, gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: { color: '#BBB', fontSize: 13 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#E8E8E8',
    borderRadius: 14, paddingVertical: 14,
    gap: 10, backgroundColor: '#FAFAFA',
    minHeight: 52,
  },
  googleIconBox: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    elevation: 2,
  },
  googleIconText: { fontSize: 16, fontWeight: '900', color: '#4285F4' },
  googleBtnText: { fontSize: 15, fontWeight: '600', color: '#333' },
  switchBtn: { alignItems: 'center', marginTop: 20 },
  switchText: { color: '#888', fontSize: 14 },
  switchLink: { color: PINK, fontWeight: '700' },
  decor1: {
    position: 'absolute', top: -50, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decor2: {
    position: 'absolute', bottom: 20, left: -60,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decor3: {
    position: 'absolute', top: 20, left: 20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});