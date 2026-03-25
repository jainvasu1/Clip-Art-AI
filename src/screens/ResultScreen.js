import React from 'react';
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, FlatList,
  ActivityIndicator, Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const STYLE_LABELS = {
  cartoon: '🎨 Cartoon',
  flat: '🎭 Flat Illustration',
  anime: '⛩️ Anime',
  pixel: '🕹️ Pixel Art',
  sketch: '✏️ Sketch',
};

export default function ResultScreen({ results, selectedStyles, onBack, onRegenerate }) {
  const handleDownload = async (styleId, base64) => {
    try {
      const path = `${RNFS.DownloadDirectoryPath}/clipart_${styleId}_${Date.now()}.png`;
      await RNFS.writeFile(path, base64, 'base64');
      Alert.alert('Saved!', 'Image saved to Downloads folder.');
    } catch (e) {
      Alert.alert('Error', 'Could not save image.');
    }
  };

  const handleShare = async (styleId, base64) => {
    try {
      await Share.open({
        title: `${STYLE_LABELS[styleId]} Clipart`,
        url: `data:image/png;base64,${base64}`,
        type: 'image/png',
      });
    } catch (e) {}
  };

  const renderItem = ({ item: styleId }) => {
    const result = results[styleId];
    return (
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{STYLE_LABELS[styleId] || styleId}</Text>

        {!result && (
          <View style={styles.skeletonBox}>
            <ActivityIndicator color="#E8837A" size="large" />
            <Text style={styles.skeletonText}>Generating...</Text>
          </View>
        )}

        {result?.status === 'success' && (
          <>
            <Image
              source={{ uri: `data:image/png;base64,${result.base64}` }}
              style={styles.resultImage}
              resizeMode="cover"
            />
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleDownload(styleId, result.base64)}>
                <Text style={styles.actionBtnText}>⬇ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.shareBtn]}
                onPress={() => handleShare(styleId, result.base64)}>
                <Text style={styles.actionBtnText}>↗ Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {result?.status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ Generation failed</Text>
            <Text style={styles.errorSub}>Please try again</Text>
          </View>
        )}
      </View>
    );
  };

  const doneCount = selectedStyles.filter(s => results[s]).length;
  const total = selectedStyles.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <Text style={styles.headerCount}>{doneCount}/{total}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(doneCount / total) * 100}%` }]} />
      </View>

      <FlatList
        data={selectedStyles}
        keyExtractor={item => item}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.regenerateBtn} onPress={onRegenerate}>
        <Text style={styles.regenerateBtnText}>🔄 Generate Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const PINK = '#E8837A';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  headerCount: {
    position: 'absolute', right: 20,
    fontSize: 14, color: '#999', fontWeight: '600',
  },
  backBtn: { position: 'absolute', left: 20 },
  backBtnText: { fontSize: 22, color: '#1A1A1A', fontWeight: '600' },

  progressBar: {
    height: 4, backgroundColor: '#F0F0F0',
    marginHorizontal: 20, borderRadius: 2, marginBottom: 16,
  },
  progressFill: {
    height: 4, backgroundColor: PINK, borderRadius: 2,
  },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff', borderRadius: 20,
    marginBottom: 16, overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8,
  },
  cardLabel: {
    fontSize: 16, fontWeight: '700', color: '#1A1A1A',
    padding: 14, paddingBottom: 10,
  },
  skeletonBox: {
    height: 200, alignItems: 'center',
    justifyContent: 'center', gap: 10,
    backgroundColor: '#FFF5F4',
  },
  skeletonText: { color: PINK, fontSize: 14, fontWeight: '600' },
  resultImage: { width: '100%', height: 280 },
  cardActions: {
    flexDirection: 'row', gap: 10, padding: 12,
  },
  actionBtn: {
    flex: 1, backgroundColor: PINK,
    borderRadius: 12, paddingVertical: 12,
    alignItems: 'center',
  },
  shareBtn: { backgroundColor: '#5B6CF6' },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  errorBox: {
    height: 120, alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  errorText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },
  errorSub: { color: '#999', fontSize: 13 },

  regenerateBtn: {
    position: 'absolute', bottom: 24, left: 20, right: 20,
    backgroundColor: '#fff',
    borderWidth: 2, borderColor: PINK,
    borderRadius: 50, paddingVertical: 16,
    alignItems: 'center',
  },
  regenerateBtnText: { color: PINK, fontSize: 16, fontWeight: '700' },
});