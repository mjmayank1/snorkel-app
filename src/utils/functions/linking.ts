import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '_utils/interfaces';

const config = {
  screens: {
    Auth: {
      screens: {
        SignIn: 'login',
      },
    },
    LogsStack: {
      screens: {
        LogDetail: 'dive-log/:diveLogId',
      },
    },
    App: {
      screens: {
        Explore: 'Beach',
      },
    },
    ExploreStack: {
      screens: {
        DiveSite: 'Beach/:diveSpotId',
      },
    },
    NotFound: '*',
  },
};

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['zentacle://', 'https://www.zentacle.com/'],
  config,
};