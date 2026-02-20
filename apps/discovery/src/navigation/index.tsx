import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import RootNavigator from './RootNavigator';
import { useTheme } from '../theme/ThemeProvider';

const linking = {
  prefixes: ['https://native-html.github.io/render']
};

export default function Navigation() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer linking={linking} theme={theme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
