import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator,
  TextInput, ScrollView,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const validateAndPick = (response, onSuccess) => {
  if (response.didCancel) return;
  if (response.errorCode) {
    Alert.alert('Error', response.errorMessage || 'Something went wrong.');
    return;
  }
  const asset = response.assets?.[0];
  if (!asset) return;
  if (!ALLOWED_TYPES.includes(asset.type)) {
    Alert.alert('Invalid Format', 'Please upload a JPEG, PNG, or WEBP image.');
    return;
  }
  const sizeMB = asset.fileSize / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    Alert.alert('Too Large', `Max 5MB allowed. Your image is ${sizeMB.toFixed(1)}MB.`);
    return;
  }
  onSuccess(asset);
};

export default function HomeScreen({ selectedStyles = [], onBack }) {
  const [image, setImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [promptEnabled, setPromptEnabled] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [bgRemove, setBgRemove] = useState(false);

  const openPicker = () => {
    Alert.alert('Upload Photo', 'Choose an option', [
      {
        text: '📷 Camera',
        onPress: () =>
          launchCamera(
            { mediaType: 'photo', includeBase64: true, quality: 0.8, maxWidth: 1024, maxHeight: 1024 },
            res => validateAndPick(res, setImage),
          ),
      },
      {
        text: '🖼️ Choose from Gallery',
        onPress: () =>
          launchImageLibrary(
            { mediaType: 'photo', includeBase64: true, quality: 0.8, maxWidth: 1024, maxHeight: 1024 },
            res => validateAndPick(res, setImage),
          ),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleGenerate = async () => {
    if (!image) return;
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Photo</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Upload your photo or selfie</Text>
        <Text style={styles.subtitle}>
          Upload your photo and we'll generate clipart versions in your selected styles.
        </Text>

        {/* Upload box */}
        {image ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
            <TouchableOpacity style={styles.removeBtn} onPress={() => setImage(null)}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>
                {(image.fileSize / (1024 * 1024)).toFixed(1)}MB · {image.width}×{image.height}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadBox} onPress={openPicker} activeOpacity={0.8}>
            <View style={styles.uploadIconCircle}>
              <Text style={styles.uploadIcon}>⬆️</Text>
            </View>
            <Text style={styles.uploadText}>Upload</Text>
            <Text style={styles.uploadHint}>JPEG, PNG or WEBP · Max 5MB</Text>
          </TouchableOpacity>
        )}

        {/* Selected styles pills */}
        {selectedStyles.length > 0 && (
          <View style={styles.pillsRow}>
            {selectedStyles.map(s => (
              <View key={s} style={styles.pill}>
                <Text style={styles.pillText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Prompt Customization */}
        <View style={styles.optionCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setPromptEnabled(!promptEnabled)}
            activeOpacity={0.8}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>✏️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Prompt Customization</Text>
                <Text style={styles.optionSub}>Add custom instructions for AI</Text>
              </View>
            </View>
            <View style={[styles.tick, promptEnabled && styles.tickActive]}>
              {promptEnabled && <Text style={styles.tickText}>✓</Text>}
            </View>
          </TouchableOpacity>

          {promptEnabled && (
            <TextInput
              style={styles.promptInput}
              placeholder="e.g. Pink and yellow floral pattern, green and yellow leaves, emerald green background"
              placeholderTextColor="#BBB"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
            />
          )}
        </View>

        {/* Background Remover */}
        <View style={styles.optionCard}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setBgRemove(!bgRemove)}
            activeOpacity={0.8}>
            <View style={styles.optionLeft}>
              <Text style={styles.optionIcon}>🪄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Remove Background</Text>
                <Text style={styles.optionSub}>Auto-remove background before generation</Text>
              </View>
            </View>
            <View style={[styles.tick, bgRemove && styles.tickActive]}>
              {bgRemove && <Text style={styles.tickText}>✓</Text>}
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Generate button */}
      <TouchableOpacity
        style={[styles.generateBtn, !image && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        activeOpacity={0.85}
        disabled={!image || generating}>
        {generating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateBtnText}>Generate</Text>
        )}
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const PINK = '#E8837A';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  backBtn: { position: 'absolute', left: 20 },
  backBtnText: { fontSize: 22, color: '#1A1A1A', fontWeight: '600' },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },

  title: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', lineHeight: 22, marginBottom: 24 },

  // Upload
  uploadBox: {
    backgroundColor: '#FFF0EF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F5C5C2',
    borderStyle: 'dashed',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadIconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    elevation: 2,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 6,
  },
  uploadIcon: { fontSize: 28 },
  uploadText: { fontSize: 16, fontWeight: '700', color: PINK },
  uploadHint: { fontSize: 12, color: '#BBB' },

  // Preview
  previewBox: {
    borderRadius: 20, overflow: 'hidden',
    height: 280, position: 'relative',
  },
  previewImage: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: PINK,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  removeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  infoBadge: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  infoBadgeText: { color: '#fff', fontSize: 11 },

  // Pills
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  pill: {
    backgroundColor: '#FFF0EF', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: '#F5C5C2',
  },
  pillText: { color: PINK, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },

  // Option cards
  optionCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 16, marginTop: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  optionIcon: { fontSize: 22 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  optionSub: { fontSize: 12, color: '#999', marginTop: 2 },
  tick: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2, borderColor: '#DDD',
    alignItems: 'center', justifyContent: 'center',
  },
  tickActive: { backgroundColor: PINK, borderColor: PINK },
  tickText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  promptInput: {
    marginTop: 12, backgroundColor: '#F8F8F8',
    borderRadius: 12, padding: 12,
    fontSize: 14, color: '#1A1A1A',
    lineHeight: 22, minHeight: 80,
    textAlignVertical: 'top',
  },

  // Generate
  generateBtn: {
    position: 'absolute', bottom: 24, left: 20, right: 20,
    backgroundColor: PINK, borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
    elevation: 6,
    shadowColor: PINK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10,
  },
  generateBtnDisabled: { backgroundColor: '#F5C5C2', elevation: 0 },
  generateBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});