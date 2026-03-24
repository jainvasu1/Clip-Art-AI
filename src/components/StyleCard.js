import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import SkeletonLoader from './SkeletonLoader';
import { COLORS } from '../constants/styles';

export default function StyleCard({ style, result }) {
  const handleDownload = async () => {
    if (!result?.base64) return;
    const path = `${RNFS.DownloadDirectoryPath}/clipart_${style.id}_${Date.now()}.png`;
    await RNFS.writeFile(path, result.base64, 'base64');
    alert(`Saved to Downloads!`);
  };

  const handleShare = async () => {
    if (!result?.base64) return;
    await Share.open({
      title: `${style.label} Clipart`,
      url: `data:image/png;base64,${result.base64}`,
      type: 'image/png',
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{style.emoji} {style.label}</Text>

      {!result && <SkeletonLoader />}

      {result?.status === 'success' && (
        <>
          <Image
            source={{ uri: `data:image/png;base64,${result.base64}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btn} onPress={handleDownload}>
              <Text style={styles.btnText}>⬇ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.shareBtn]} onPress={handleShare}>
              <Text style={styles.btnText}>↗ Share</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {result?.status === 'error' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ Generation failed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shareBtn: {
    backgroundColor: '#1D4ED8',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorBox: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
  },
});