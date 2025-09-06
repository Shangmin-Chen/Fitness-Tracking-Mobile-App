import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState('lbs'); // lbs or kg

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your workout logs and templates. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const handleBackupData = () => {
    Alert.alert('Backup Data', 'Cloud backup feature coming soon!');
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color="#1a1a1a" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
          <View style={styles.headerPattern}>
            <View style={styles.patternTriangle} />
            <View style={[styles.patternTriangle, styles.patternTriangleSmall]} />
            <View style={[styles.patternTriangle, styles.patternTriangleLarge]} />
          </View>
        </View>

        {/* App Settings */}
        <SettingSection title="App Settings">
          <SettingItem
            icon="notifications"
            title="Notifications"
            subtitle="Get reminded about workouts"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#c7c7cc', true: '#1a1a1a' }}
                thumbColor={notifications ? '#ffffff' : '#f8f8f8'}
              />
            }
            showArrow={false}
          />
          <SettingItem
            icon="phone-portrait"
            title="Haptic Feedback"
            subtitle="Vibration feedback for interactions"
            rightComponent={
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: '#c7c7cc', true: '#1a1a1a' }}
                thumbColor={hapticFeedback ? '#ffffff' : '#f8f8f8'}
              />
            }
            showArrow={false}
          />
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#c7c7cc', true: '#1a1a1a' }}
                thumbColor={darkMode ? '#ffffff' : '#f8f8f8'}
              />
            }
            showArrow={false}
          />
        </SettingSection>

        {/* Workout Settings */}
        <SettingSection title="Workout Settings">
          <SettingItem
            icon="scale"
            title="Weight Units"
            subtitle={`Currently using ${units}`}
            onPress={() => {
              Alert.alert(
                'Weight Units',
                'Choose your preferred weight unit',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Pounds (lbs)', onPress: () => setUnits('lbs') },
                  { text: 'Kilograms (kg)', onPress: () => setUnits('kg') },
                ]
              );
            }}
          />
          <SettingItem
            icon="timer"
            title="Rest Timer"
            subtitle="Set default rest periods"
            onPress={() => Alert.alert('Rest Timer', 'Rest timer settings coming soon!')}
          />
          <SettingItem
            icon="barbell"
            title="Exercise Categories"
            subtitle="Manage exercise categories"
            onPress={() => Alert.alert('Exercise Categories', 'Category management coming soon!')}
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management">
          <SettingItem
            icon="cloud-upload"
            title="Backup Data"
            subtitle="Save your data to the cloud"
            onPress={handleBackupData}
          />
          <SettingItem
            icon="download"
            title="Export Data"
            subtitle="Export your workout data"
            onPress={handleExportData}
          />
          <SettingItem
            icon="trash"
            title="Clear All Data"
            subtitle="Permanently delete all data"
            onPress={handleClearData}
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <SettingItem
            icon="information-circle"
            title="App Version"
            subtitle="1.0.0"
            showArrow={false}
          />
          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Rate us on the App Store"
            onPress={() => Alert.alert('Rate App', 'Thank you for your support!')}
          />
          <SettingItem
            icon="mail"
            title="Contact Support"
            subtitle="Get help and support"
            onPress={() => Alert.alert('Contact Support', 'support@2plates.app')}
          />
          <SettingItem
            icon="document-text"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')}
          />
          <SettingItem
            icon="document"
            title="Terms of Service"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon!')}
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>2Plates</Text>
          <Text style={styles.appDescription}>
            Your personal gym companion for tracking workouts and achieving fitness goals.
          </Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: '400',
  },
  headerPattern: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  patternTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f0f0f0',
    marginBottom: 8,
  },
  patternTriangleSmall: {
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    marginLeft: 12,
  },
  patternTriangleLarge: {
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    marginLeft: 6,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
    letterSpacing: -0.3,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f2f2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  appDescription: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: '400',
  },
  appVersion: {
    fontSize: 12,
    color: '#c7c7cc',
    fontWeight: '500',
  },
});
