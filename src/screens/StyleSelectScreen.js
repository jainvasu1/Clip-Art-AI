import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, FlatList, Image,
} from 'react-native';

const ALL_STYLES = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    image: 'https://img.freepik.com/free-photo/3d-cartoon-style-character_23-2151034019.jpg',
  },
  {
    id: 'flat',
    label: 'Flat Illustration',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMpY4km9mO9jCI7M0a06alTnWakL6Wx2F9qA&s',
  },
  {
    id: 'anime',
    label: 'Anime',
    image: 'https://png.pngtree.com/png-clipart/20250520/original/pngtree-cute-anime-style-girl-png-image_21036715.png',
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    image: 'https://i.etsystatic.com/49765647/r/il/8ac30d/5688023580/il_570xN.5688023580_1dwu.jpg',
  },
  {
    id: 'sketch',
    label: 'Sketch / Outline',
    image: 'https://r2.starryai.com/results/1024014253/1687f728-9c55-4777-833e-44f0da49ae31.webp',
  },
];

export default function StyleSelectScreen({ onStylesSelected }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = ALL_STYLES.filter(s =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStyle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item, index }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}
        onPress={() => toggleStyle(item.id)}
        activeOpacity={0.85}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />

        {/* Tick badge */}
        {isSelected && (
          <View style={styles.tickBadge}>
            <Text style={styles.tickText}>✓</Text>
          </View>
        )}

        {/* Selected overlay */}
        {isSelected && <View style={styles.selectedOverlay} />}

        <Text style={styles.cardLabel}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Art Style</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* Generate button */}
      {selected.length > 0 && (
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={() => onStylesSelected(selected)}
          activeOpacity={0.85}>
          <Text style={styles.generateBtnText}>
            Generate {selected.length} Style{selected.length > 1 ? 's' : ''}  →
          </Text>
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F8F8' },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },

  grid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    flex: 1,
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  // Selected state
  selectedOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 160,
    backgroundColor: 'rgba(232,131,122,0.25)',
    borderWidth: 3,
    borderColor: '#E8837A',
    borderRadius: 18,
  },
  tickBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8837A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 5,
  },
  tickText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },

  generateBtn: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#E8837A',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#E8837A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  generateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});