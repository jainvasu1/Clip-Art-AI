import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image,
  StyleSheet, ScrollView, SafeAreaView,
  ActivityIndicator, Alert, Platform,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, STYLES_LIST } from '../constants/styles';
import StyleCard from '../components/StyleCard';
import { generateAllStyles } from '../services/aiService';

// Max allowed file size: 5MB
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const validateAndPickImage = (response, onSuccess) => {
  if (response.didCancel) return;
  if (response.errorCode) {
    Alert.alert('Camera Error', response.errorMessage || 'Something went wrong.');
    return;
  }

  const asset = response.assets?.[0];
  if (!asset) return;

  // Validate format
  if (!ALLOWED_TYPES.includes(asset.type)) {
    Alert.alert(
      'Invalid Format',
      'Please upload a JPEG, PNG, or WEBP image.',
    );
    return;
  }

  // Validate size (fileSize is in bytes)
  const sizeMB = asset.fileSize / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    Alert.alert(
      'Image Too Large',
      `Please use an image under ${MAX_FILE_SIZE_MB}MB. Your image is ${sizeMB.toFixed(1)}MB.`,
    );
    return;
  }

  onSuccess(asset);
};

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState({});
  const [generating, setGenerating] = useState(false);

  const pickFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,          // compress to 80%
        maxWidth: 1024,         // resize large images
        maxHeight: 1024,
      },
      response =>
        validateAndPickImage(response, asset => {
          setImage(asset);
          setResults({});
        }),
    );
};

  const pickFromCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        saveToPhotos: false,
        cameraType: 'back',
      },
      response => {
        if (response.errorCode === 'camera_unavailable') {
          Alert.alert('Error', 'Camera not available on this device.');
          return;
        }
        validateAndPickImage(response, asset => {
          setImage(asset);
          setResults({});
        });
      },
    );
  };

  const handleGenerate = async () => {
    if (!image?.base64) {
      return;
    }
    setGenerating(true);
    setResults({});

    await generateAllStyles(image.base64, (styleId, result) => {
      setResults(prev => ({ ...prev, [styleId]: result }));
    });

    setGenerating(false);
  };

  const handleChangeImage = () => {
    Alert.alert('Change Image', 'Choose an option', [
      { text: '📁 Gallery', onPress: pickFromGallery},
      { text: '📷 Camera', onPress: pickFromCamera },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={['#7C3AED', '#4F46E5']} style={styles.header}>
          <Text style={styles.title}>✨ ClipArt AI</Text>
          <Text style={styles.subtitle}>Transform your photo into art</Text>
        </LinearGradient>

        {/* Upload Area */}
        <View style={styles.uploadSection}>
          {image ? (
            <>
              {/* Preview */}
              <View style={styles.previewWrapper}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.preview}
                  resizeMode="cover"
                />
                {/* Image info badge */}
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>
                    {(image.fileSize / (1024 * 1024)).toFixed(1)}MB · {image.width}×{image.height}
                  </Text>
                </View>
              </View>

              {/* Change image button */}
              <TouchableOpacity style={styles.changeBtn} onPress={handleChangeImage}>
                <Text style={styles.changeBtnText}>🔄 Change Image</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Empty state */}
<TouchableOpacity style={styles.placeholder} onPress={handleChangeImage}>
                <Text style={styles.placeholderIcon}>🖼️</Text>
                <Text style={styles.placeholderTitle}>Upload Your Photo</Text>
                <Text style={styles.placeholderSub}>JPEG, PNG or WEBP · Max 5MB</Text>
              </TouchableOpacity>

            </>
          )}
        </View>

        {/* Generate Button */}
        {image && !generating && (
          <TouchableOpacity onPress={handleGenerate} activeOpacity={0.85}>
            <LinearGradient
              colors={['#7C3AED', '#6D28D9']}
              style={styles.generateBtn}>
              <Text style={styles.generateBtnText}>🚀 Generate All Styles</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Generating state */}
        {generating && (
          <View style={styles.generatingBanner}>
            <ActivityIndicator color={COLORS.accentLight} />
            <Text style={styles.generatingText}>
              Generating {STYLES_LIST.length} styles in parallel...
            </Text>
          </View>
        )}

        {/* Results */}
        {(generating || Object.keys(results).length > 0) && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Generated Styles</Text>
            {STYLES_LIST.map(style => (
              <StyleCard
                key={style.id}
                style={style}
                result={results[style.id]}
              />
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingBottom: 40 },
  header: {
    padding: 28,
    paddingTop: 44,
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  uploadSection: { margin: 16 },

  previewWrapper: { position: 'relative', marginBottom: 12 },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 16,
  },
  infoBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  infoBadgeText: { color: '#fff', fontSize: 12 },

  changeBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  changeBtnText: { color: COLORS.text, fontWeight: '600' },

  placeholder: {
    height: 200,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderIcon: { fontSize: 44 },
  placeholderTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  placeholderSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  uploadBtns: { flexDirection: 'row', gap: 12 },
  uploadBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  uploadBtnIcon: { fontSize: 24 },
  uploadBtnText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },

  generateBtn: {
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  generateBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  generatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    padding: 14,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  generatingText: { color: COLORS.accentLight, fontWeight: '600' },

  resultsSection: { margin: 16 },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
  },
});

