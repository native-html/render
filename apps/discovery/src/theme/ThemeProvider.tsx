import * as React from 'react';
import {
  DefaultTheme as NavLightTheme,
  DarkTheme as NavDarkTheme,
  Theme
} from '@react-navigation/native';
import { PropsWithChildren } from 'react';
import {
  Provider as PaperProvider,
  MD2DarkTheme as PaperDarkTheme,
  MD2LightTheme as PaperLightTheme,
  MD2Theme
} from 'react-native-paper';
import themeAdaptedColors, { ColorsShape } from './themeAdaptedColors';
import { useColorScheme } from '../state/ColorSchemeProvider';
import { ColorPrimitivesProvider } from './colorSystem';
import colorPrimitivesDeclarations from './colorPrimitivesDeclaration';
import DefaultColorRolesProvider from '../components/croles/DefaultColorRolesProvider';

function mergeTheme(
  paperTheme: MD2Theme,
  navTheme: Theme,
  colors: ColorsShape
) {
  return {
    ...paperTheme,
    ...navTheme,
    roundness: 0,
    colors
  };
}

const CombinedLightTheme = mergeTheme(
  PaperLightTheme,
  NavLightTheme,
  themeAdaptedColors.light
);

const CombinedDarkTheme = mergeTheme(
  PaperDarkTheme,
  NavDarkTheme,
  themeAdaptedColors.dark
);

const ThemeContext = React.createContext(CombinedLightTheme);

export function useTheme() {
  return React.useContext(ThemeContext);
}

export default function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const colorScheme = useColorScheme();
  const selectedTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;
  return (
    <ColorPrimitivesProvider value={colorPrimitivesDeclarations[colorScheme]}>
      <DefaultColorRolesProvider>
        <ThemeContext.Provider value={selectedTheme}>
          <PaperProvider theme={selectedTheme}>{children}</PaperProvider>
        </ThemeContext.Provider>
      </DefaultColorRolesProvider>
    </ColorPrimitivesProvider>
  );
}
