import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import {GOOGLE_WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export default function LoginScreen({onLoginSuccess}) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
        userInfo.accessToken,
      );
      await auth().signInWithCredential(googleCredential);
      onLoginSuccess();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Please wait', 'Sign in already in progress');
      } else {
        Alert.alert('Error', 'Google Sign-In failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#0A0A0F', '#1A0A2E', '#0A0A0F']}
        style={styles.container}>

        {/* Top decoration */}
        <View style={styles.topDecor}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>

        {/* Logo & Heading */}
        <View style={styles.heroSection}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.heading}>Welcome to{'\n'}ClipArt AI</Text>
          <Text style={styles.subheading}>Transform your photos into stunning art</Text>
        </View>

        {/* Feature points */}
        <View style={styles.featuresCard}>
          {[
            { icon: '🎨', text: 'Cartoon, Anime, Pixel & more styles' },
            { icon: '⚡', text: 'Generate all styles in parallel instantly' },
            { icon: '💾', text: 'Download & share your creations' },
            { icon: '🔒', text: 'Secure & private — your photos stay yours' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{item.icon}</Text>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Google Sign In Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#1A1A2E" size="small" />
            ) : (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service{'\n'}and Privacy Policy
          </Text>
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A0F' },
  container: { flex: 1, paddingHorizontal: 24 },

  topDecor: { position: 'absolute', top: 0, left: 0, right: 0 },
  circle1: {
    position: 'absolute', top: -60, right: -60,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(124,58,237,0.15)',
  },
  circle2: {
    position: 'absolute', top: 40, left: -80,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(79,70,229,0.1)',
  },

  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emoji: { fontSize: 56, marginBottom: 16 },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 12,
  },

  featuresCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: { fontSize: 22 },
  featureText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  bottomSection: { paddingBottom: 40 },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  terms: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});