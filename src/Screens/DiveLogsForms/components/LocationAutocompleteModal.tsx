import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  FlatList,
  Keyboard,
  SafeAreaView,
  Pressable,
} from 'react-native';
import debounce from 'lodash/debounce';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { stringify } from 'qs';
import NetInfo from '@react-native-community/netinfo';

import type { FunctionComponent } from 'react';
import type { FieldRenderProps } from 'react-final-form';
import PlainSearchInput from '_components/ui/PlainSearchInput';
import {
  handleTypeAhead,
  handleTypeAheadNearby,
} from '_redux/slices/search/api';
import { TypeaheadResponse } from '_utils/interfaces/data/search';

import LocationImage from '_assets/LocationLargish.png';
import { isBelowHeightThreshold } from '_utils/constants';
import { sendEvent } from '_utils/functions/amplitude';
import { offlineTypeAhead } from '_utils/functions/offline-location-search';
import { CompositeNavigationProp } from '@react-navigation/native';
import { AppTabsParamList, RootStackParamList } from '_utils/interfaces';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SimpleDiveLogsFormsNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabsParamList, 'LogsForm'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface BaseProps {
  navigation: SimpleDiveLogsFormsNavigationProps;
  isVisible: boolean;
  closeModal: () => void;
  reset: () => void;
}
type FinalFormProps = FieldRenderProps<
  {
    lat: number;
    lng: number;
    desc: string;
  },
  any
>;

type ModalWFinalFormProps = BaseProps & FinalFormProps;

const HEIGHT = Dimensions.get('window').height;

const LocationAutocompleteModal: FunctionComponent<ModalWFinalFormProps> = ({
  isVisible,
  closeModal,
  input: { onChange, value },
  ...props
}) => {
  const { t } = useTranslation();
  const [text, changeText] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<TypeaheadResponse[]>([]);

  React.useEffect(() => {
    sendEvent('page_view', {
      type: 'dive_log__select_location',
    });
    Geolocation.getCurrentPosition(
      async position => {
        const queryObj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const queryString = stringify(queryObj);
        const response = await handleTypeAheadNearby(queryString);

        if (response.data) {
          setSuggestions(response.data);
        }
      },
      err => console.error(err),
    );
  }, [isVisible]);

  React.useEffect(() => {
    if (value) {
      changeText(value.desc);
    } else {
      changeText('');
    }
  }, [isVisible, value]);

  const makeRequest = React.useMemo(
    () =>
      debounce(async (val: string) => {
        const connectionState = await NetInfo.fetch();
        if (connectionState.isConnected) {
          const queryObj = {
            query: val,
            beach_only: 'True',
          };
          const queryString = stringify(queryObj);
          const response = await handleTypeAhead(queryString);

          if (response.data) {
            setSuggestions(response.data);
          }
        } else {
          const response = offlineTypeAhead(val);
          setSuggestions(response);
        }
      }, 500),
    [],
  );

  const handleTextChange = (val: string) => {
    if (val.trim().length) {
      changeText(val);
      makeRequest(val);
    } else {
      changeText(val);
      setSuggestions([]);
    }
  };

  const setPlace = async (place: TypeaheadResponse) => {
    changeText(place.text);
    setSuggestions([]);
    Keyboard.dismiss();

    onChange({
      beach_id: place.id,
      desc: place.text,
      location_city: place.subtext,
      lat: place.data.latitude,
      lng: place.data.longitude,
    });
    closeModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSuggestions([]);
  };

  const _renderItem = (item: { item: TypeaheadResponse | null }) => {
    return item && item.item ? (
      <Pressable
        onPress={() => setPlace(item.item!)}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#cecece' : 'transparent',
          },
        ]}>
        <View style={styles.resultContainer}>
          <Image source={LocationImage} />
          <View style={styles.placeContainer}>
            <Text style={styles.place}>{item.item.text}</Text>
            <Text style={styles.placeSubText}>{item.item.subtext}</Text>
          </View>
        </View>
      </Pressable>
    ) : (
      <Pressable
        onPress={() => {
          handleCloseModal();
          props.navigation.navigate('LogsFormStack', {
            screen: 'NewDiveSite',
          });
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#cecece' : 'transparent',
          },
        ]}>
        <View style={styles.resultContainer}>
          <Image source={LocationImage} />
          <View style={styles.placeContainer}>
            <Text style={styles.place}>Add new dive site</Text>
            <Text style={styles.placeSubText}>
              Share a new spot with the community
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const _keyExtractor = (item: TypeaheadResponse | null) =>
    item ? item.url : 'add_new_dive_site';

  return (
    <Modal
      visible={isVisible}
      onRequestClose={closeModal}
      animationType="slide"
      presentationStyle="pageSheet"
      style={styles.modal}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon
            name="chevron-back-outline"
            size={30}
            style={{ marginRight: 10 }}
            onPress={handleCloseModal}
            color="black"
          />
          <PlainSearchInput
            onChange={handleTextChange}
            value={text}
            containerStyle={styles.inputCompContainer}
            style={styles.search}
            placeholder={t('LOCATION_SITE_DIVER')}
            placeholderTextColor="grey"
            autoFocus
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            keyExtractor={_keyExtractor}
            renderItem={_renderItem}
            showsVerticalScrollIndicator={false}
            data={[...suggestions, null]}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6F9',
    flex: 1,
  },
  listContainer: {
    marginBottom: 100,
  },
  modal: {},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HEIGHT * 0.04,
    borderBottomColor: '#A9BEBF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    paddingHorizontal: isBelowHeightThreshold ? 15 : 25,
    paddingBottom: 20,
  },
  inputCompContainer: {
    paddingVertical: 8,
    borderRadius: 18,
  },
  searchLabel: {
    marginLeft: 15,
    color: 'grey',
    fontSize: 17,
  },
  search: {
    color: 'black',
    fontSize: 16,
    minWidth: isBelowHeightThreshold ? '70%' : '75%',
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryTextsContainer: {
    marginLeft: 15,
  },
  countryMainText: {
    fontSize: 15,
    color: 'grey',
  },
  searchText: {
    fontSize: 15,
    color: 'black',
    marginBottom: 2,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 25,
  },
  placeContainer: {
    marginLeft: 15,
  },
  place: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  placeSubText: {
    color: 'grey',
    fontSize: 13,
  },
});

export default LocationAutocompleteModal;
