import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { watchlist } from '../services/api';

export const WatchlistScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await watchlist.getAll();
      setItems(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await watchlist.removeItem(id);
              setItems(items.filter((item) => item.id !== id));
            } catch (error) {
              console.error('Error removing item:', error);
              Alert.alert('Error', 'Failed to remove item from watchlist');
            }
          },
        },
      ]
    );
  };

  const handleOpenInPlatform = (item) => {
    const deepLink = `${item.platform.deep_link_prefix}${item.tmdb_id}`;
    // Use Linking API to open the deep link
    // Linking.openURL(deepLink);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : 'https://via.placeholder.com/200x300',
        }}
        style={styles.poster}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.platform}>{item.platform.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.watchButton]}
            onPress={() => handleOpenInPlatform(item)}
          >
            <Text style={styles.buttonText}>Watch Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => handleRemoveItem(item.id)}
          >
            <Text style={[styles.buttonText, styles.removeButtonText]}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Watchlist</Text>
      
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your watchlist is empty. Add some movies or shows!
          </Text>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.searchButtonText}>Search Content</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  list: {
    paddingBottom: 20,
  },
  itemCard: {
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
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  platform: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  watchButton: {
    backgroundColor: '#007AFF',
  },
  removeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  removeButtonText: {
    color: '#ff3b30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 