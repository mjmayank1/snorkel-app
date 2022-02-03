import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import type {
  RootStackParamList,
  OnboardingStackParamList,
} from '_utils/interfaces';

import GradientCircle from '_components/ui/GradientCircle';
import Button from '_components/ui/Buttons/Button';

const HEIGHT = Dimensions.get('window').width;

type LocationPermissionsNavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<OnboardingStackParamList, 'LocationPermissions'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface LocationPermissionsProps {
  navigation: LocationPermissionsNavigationProps;
}

const LocationPermissions: FunctionComponent<LocationPermissionsProps> = ({
  navigation,
}) => {
  const navigateToMeasurementType = () => {
    navigation.navigate('MeasurementType');
  };

  const handleLocationPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const PermissionsLocationAndroid = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (PermissionsLocationAndroid === RESULTS.GRANTED) {
          navigateToMeasurementType();
        }
      } else {
        const PermissionsLocationIOS = await request(
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        );

        if (PermissionsLocationIOS === RESULTS.GRANTED) {
          navigateToMeasurementType();
        }
      }
    } catch (err) {
      console.warn('there was an error', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <GradientCircle
          gradientColors={['#AA00FF', '#00E0FF', '#00E0FF']}
          gradientLocations={[0.002, 1, 1]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1.06,
            y: 1.2,
          }}>
          <Icon name="location-outline" size={40} />
        </GradientCircle>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionMainText}>Enable Location</Text>
          <Text style={styles.descriptionSubText}>
            Your location will be used to show dive locations near you
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          onPress={handleLocationPermissions}
          gradient
          gradientColors={['#AA00FF', '#00E0FF', '#00E0FF']}
          gradientLocations={[0.01, 1, 1]}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 0.06,
            y: 2.2,
          }}
          style={{
            container: styles.buttonContainer,
            text: styles.buttonText,
          }}>
          Enable
        </Button>
        <Button
          onPress={() => {
            Alert.alert('We need to handle this case');
          }}
          textGradient
          start={{
            x: 0,
            y: 1,
          }}
          end={{
            x: 0.65,
            y: 0.4,
          }}
          gradientColors={['#AA00FF', '#AA00FF', '#00E0FF']}
          style={{
            container: styles.buttonContainer,
            text: styles.buttonText,
          }}>
          Disable
        </Button>
        <View style={styles.buttonsDescriptionContainer}>
          <Text style={styles.buttonsDescriptionText}>
            Magically secured to make all security concerns go away
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6F9',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 55,
    marginTop: HEIGHT * 0.26,
    alignItems: 'center',
  },
  footer: {
    height: 200,
    marginHorizontal: 25,
  },
  descriptionContainer: {
    marginTop: HEIGHT < 400 ? HEIGHT * 0.07 : HEIGHT * 0.08,
    marginHorizontal: 5,
  },
  descriptionSubText: {
    color: '#AAA',
    textAlign: 'center',
    fontSize: 16,
  },
  descriptionMainText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: HEIGHT < 400 ? HEIGHT * 0.07 : HEIGHT * 0.08,
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: HEIGHT < 400 ? 14 : 16,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonsDescriptionContainer: {
    marginHorizontal: 35,
    marginTop: 10,
  },
  buttonsDescriptionText: {
    color: '#AAA',
    textAlign: 'center',
  },
});

export default LocationPermissions;
