import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { platforms } from '../services/api';

export const HomeScreen = ({ navigation }) => {
  const [userPlatforms, setUserPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPlatforms();
  }, []);

  const loadUserPlatforms = async () => {
    try {
      const data = await platforms.getUserPlatforms();
      setUserPlatforms(data);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlatform = ({ item }) => (
    <TouchableOpacity
      style={styles.platformCard}
      onPress={() => navigation.navigate('PlatformContent', { platform: item })}
    >
      <Image
        source={{ uri: item.platform.icon }}
        style={styles.platformIcon}
        resizeMode="contain"
      />
      <Text style={styles.platformName}>{item.platform.name}</Text>
    </TouchableOpacity>
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
      <Text style={styles.title}>Your Platforms</Text>
      
      {userPlatforms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven&apos;t added any platforms yet.
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.addButtonText}>Add Platforms</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={userPlatforms}
          renderItem={renderPlatform}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.platformList}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  platformList: {
    paddingBottom: 20,
  },
  platformCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  platformIcon: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
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
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 