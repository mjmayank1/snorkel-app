import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAppSelector, useAppDispatch } from '_redux/hooks';
import { selectUser, getCurrentUser } from '_redux/slices/user';
import { selectAllDiveLogs } from '_redux/slices/dive-logs';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import type { RootStackParamList, AppTabsParamList } from '_utils/interfaces';

import ProfileDefault from '_assets/profile-placeholder.png';

import DiveLogSummary from './components/DiveLogSummary';
import SubscriptionBox from './components/SubscriptionBox';
import DiveLogDisplay from './components/DiveLogDisplay';
import { isBelowHeightThreshold } from '_utils/constants';

type ProfileNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabsParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ProfileProps {
  navigation: ProfileNavigationProps;
}

const Profile: FunctionComponent<ProfileProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const navigateToSettings = () => {
    navigation.navigate('SettingsStack', {
      screen: 'Settings',
    });
  };

  const navigateToDiveLog = (diveLogId: number) => {
    navigation.navigate('LogsStack', {
      screen: 'LogDetail',
      params: {
        diveLogId,
      },
    });
  };

  const user = useAppSelector(selectUser);
  const diveLogs = Object.values(useAppSelector(selectAllDiveLogs));

  return (
    <SafeAreaView style={styles.container}>
      <Icon
        style={styles.optionsIcon}
        onPress={navigateToSettings}
        name="options-outline"
        size={30}
        color="black"
      />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          {user?.profile_pic ? (
            <Image
              style={styles.profileImage}
              source={{ uri: user.profile_pic }}
            />
          ) : (
            <Image style={styles.profileImage} source={ProfileDefault} />
          )}
        </View>
        <Text style={styles.displayName}>{user?.display_name}</Text>

        <DiveLogSummary diveLogs={diveLogs} />
        <SubscriptionBox />

        <View>
          <Text style={styles.diveLogsLabel}>
            {!!diveLogs.length ? 'Dive Log Photos' : 'No Dive Logs'}
          </Text>
          <View style={styles.photosContainer}>
            {diveLogs.map((diveLog, index) => {
              return (
                <DiveLogDisplay
                  diveLog={diveLog}
                  key={index}
                  navigateToDiveLog={navigateToDiveLog}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6F9',
  },
  contentContainer: {
    marginHorizontal: 25,
    marginTop: 20,
    marginBottom: isBelowHeightThreshold ? 80 : 65,
    paddingBottom: 50,
  },
  text: {
    color: 'black',
    fontSize: isBelowHeightThreshold ? 17 : 18,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: isBelowHeightThreshold ? 20 : 40,
  },
  profileImage: {
    width: isBelowHeightThreshold ? 100 : 120,
    height: isBelowHeightThreshold ? 100 : 120,
    borderRadius: isBelowHeightThreshold ? 50 : 60,
  },
  optionsIcon: {
    alignSelf: 'flex-end',
    marginRight: 25,
    marginTop: isBelowHeightThreshold ? 10 : 5,
  },
  displayName: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 25,
    marginVertical: 15,
    color: 'black',
  },
  diveLogsLabel: {
    fontWeight: '500',
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  photosContainer: {
    marginBottom: 10,
  },
});

export default Profile;