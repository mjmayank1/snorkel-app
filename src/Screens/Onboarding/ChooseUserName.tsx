import React from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import type {
  RootStackParamList,
  OnboardingStackParamList,
} from '_utils/interfaces';

import Input from '_components/ui/Input';
import Button from '_components/ui/Buttons/Button';

const HEIGHT = Dimensions.get('window').width;

type ChooseUserNameScreenNavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<OnboardingStackParamList, 'ChooseUserName'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface ChooseUserNameProps {
  navigation: ChooseUserNameScreenNavigationProps;
}

const ChooseUserName: FunctionComponent<ChooseUserNameProps> = props => {
  const navigateToAvatar = () => {
    props.navigation.navigate('ChooseAvatar');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>What's your username?</Text>
          <Text style={styles.headerSubtext}>
            How you will appear in Zentacle
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Name</Text>
          <Input
            placeholder="Username"
            placeholderTextColor="#BFBFBF"
            containerStyle={styles.input}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          onPress={navigateToAvatar}
          gradient
          gradientColors={['#AA00FF', '#00E0FF']}
          gradientLocations={[0.0332, 1]}
          start={{
            x: 0.003,
            y: 3.75,
          }}
          end={{
            x: 1.5,
            y: 0.08,
          }}
          style={{
            container: {
              backgroundColor: 'white',
              borderRadius: 12,
              padding: HEIGHT < 400 ? 12 : 16,
              marginVertical: HEIGHT < 400 ? 10 : 20,
              marginHorizontal: 0,
            },
            text: {
              color: '#FFF',
              fontSize: 16,
              fontWeight: '800',
            },
          }}>
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6F9',
  },
  headerContainer: {
    marginTop: HEIGHT < 400 ? HEIGHT * 0.2 : HEIGHT * 0.3,
    marginBottom: HEIGHT < 400 ? HEIGHT * 0.08 : HEIGHT * 0.12,
  },
  headerText: {
    color: 'black',
    fontSize: 35,
    fontWeight: '700',
  },
  headerSubtext: {
    color: 'black',
    marginTop: 8,
  },
  inputContainer: {},
  input: {
    marginHorizontal: 0,
    borderColor: 'whitesmoke',
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputLabel: {
    color: 'black',
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 25,
  },
  footer: {
    marginHorizontal: 25,
  },
});

export default ChooseUserName;
