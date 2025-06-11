import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { platforms } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export const SettingsScreen = ({ navigation }) => {
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [userPlatforms, setUserPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      const [allPlatforms, userPlatformsData] = await Promise.all([
        platforms.getAll(),
        platforms.getUserPlatforms(),
      ]);
      setAvailablePlatforms(allPlatforms);
      setUserPlatforms(userPlatformsData);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = async (platformId, isActive) => {
    try {
      const userPlatform = userPlatforms.find(
        (up) => up.platform.id === platformId
      );
      if (userPlatform) {
        await platforms.updateUserPlatform(userPlatform.id, {
          is_active: !isActive,
        });
        setUserPlatforms(
          userPlatforms.map((up) =>
            up.id === userPlatform.id
              ? { ...up, is_active: !isActive }
              : up
          )
        );
      } else {
        const newUserPlatform = await platforms.updateUserPlatform(null, {
          platform: platformId,
          is_active: true,
        });
        setUserPlatforms([...userPlatforms, newUserPlatform]);
      }
    } catch (error) {
      console.error('Error updating platform:', error);
      Alert.alert('Error', 'Failed to update platform settings');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const renderPlatformItem = ({ item: platform }) => {
    const userPlatform = userPlatforms.find(
      (up) => up.platform.id === platform.id
    );
    const isActive = userPlatform?.is_active ?? false;

    return (
      <View style={[styles.platformItem, { borderBottomColor: theme.border }]}>
        <View style={styles.platformInfo}>
          <Image source={{ uri: platform.icon }} style={styles.platformIcon} />
          <Text style={[styles.platformName, { color: theme.text }]}>{platform.name}</Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={() => handlePlatformToggle(platform.id, isActive)}
          trackColor={theme.switchTrack}
          thumbColor={isActive ? theme.switchThumb.true : theme.switchThumb.false}
        />
      </View>
    );
  };

  const renderSettingItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.settingInfo}>
        <Ionicons name={icon} size={24} color={theme.primary} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
      </View>
      {value !== undefined ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={theme.switchTrack}
          thumbColor={value ? theme.switchThumb.true : theme.switchThumb.false}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        {renderSettingItem({
          icon: isDarkMode ? 'moon' : 'sunny',
          title: 'Dark Mode',
          value: isDarkMode,
          onPress: toggleTheme,
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Streaming Platforms</Text>
        <FlatList
          data={availablePlatforms}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlatformItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: screenWidth > 400 ? 32 : 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    width: 32,
    height: 32,
    marginRight: 15,
    borderRadius: 6,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
