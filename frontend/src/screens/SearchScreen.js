import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { watchlist } from '../services/api';

const TMDB_API_KEY = 'a756f485d0e8e5a1f5b8e0376dea5cf2'; // <-- Hardcoded here
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const searchContent = async (text) => {
    if (!text.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          text
        )}`
      );
      const data = await response.json();
      setResults(data.results.filter((item) => item.media_type !== 'person'));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (text) => {
    setQuery(text);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      searchContent(text);
    }, 500); // 500ms debounce
  };

  const handleAddToWatchlist = async (item) => {
    try {
      await watchlist.addItem({
        title: item.title || item.name || 'Untitled',
        tmdb_id: item.id.toString(),
        media_type: item.media_type,
        poster_path: item.poster_path,
      });
      // You can show a success message here if you want
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('ContentDetails', { content: item })}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : 'https://via.placeholder.com/200x300',
        }}
        style={styles.poster}
      />
      <View style={styles.resultInfo}>
        <Text style={styles.title}>{item.title || item.name || 'Untitled'}</Text>
        <Text style={styles.type}>
          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToWatchlist(item)}
        >
          <Text style={styles.addButtonText}>Add to Watchlist</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies and TV shows..."
          value={query}
          onChangeText={handleInputChange}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 16,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  type: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
