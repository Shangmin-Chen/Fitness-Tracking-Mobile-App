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
import { Header } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';

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

  interface SettingItemProps {
    icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }

  const SettingItem: React.FC<SettingItemProps> = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={COLORS.text.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={16} color={COLORS.text.secondary} />
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

  const headerPattern = (
    <>
      <View style={styles.patternTriangle} />
      <View style={[styles.patternTriangle, styles.patternTriangleSmall]} />
      <View style={[styles.patternTriangle, styles.patternTriangleLarge]} />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Settings"
          subtitle="Customize your experience"
          pattern={headerPattern}
        />

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
                trackColor={{ false: COLORS.text.disabled, true: COLORS.text.primary }}
                thumbColor={notifications ? COLORS.surface : '#f8f8f8'}
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
                trackColor={{ false: COLORS.text.disabled, true: COLORS.text.primary }}
                thumbColor={hapticFeedback ? COLORS.surface : '#f8f8f8'}
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
                trackColor={{ false: COLORS.text.disabled, true: COLORS.text.primary }}
                thumbColor={darkMode ? COLORS.surface : '#f8f8f8'}
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
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
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
    marginBottom: SPACING.sm,
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
    marginTop: SPACING.xxxl,
    paddingHorizontal: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    letterSpacing: -0.3,
  },
  sectionContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow.color,
    shadowOffset: COLORS.shadow.offset,
    shadowOpacity: COLORS.shadow.opacity,
    shadowRadius: COLORS.shadow.radius,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    marginRight: SPACING.lg,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  settingSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    marginTop: SPACING.xl,
  },
  appName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
  },
  appDescription: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.md,
    fontWeight: '400',
  },
  appVersion: {
    fontSize: 12,
    color: COLORS.text.disabled,
    fontWeight: '500',
  },
});