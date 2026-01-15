import { StacksProvider } from '@mobily/stacks';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import useCachedResources from './src/hooks/useCachedResources';
import Navigation from './src/navigation';
import ThemeProvider from './src/theme/ThemeProvider';
import ColorSchemeProvider from './src/state/ColorSchemeProvider';
import UILinkPressDisplayMolecule from './src/components/UILinkPressDisplayMolecule';
import contentWidthContextNucleon from './src/components/nucleons/contentWidthContextNucleon';
import PageToolkitProvider from './src/providers/PageToolkitProvider';

enableScreens();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const initialColorScheme = useColorScheme();
  const contentWidth = useWindowDimensions().width;

  if (!isLoadingComplete) return;

  return (
    <contentWidthContextNucleon.Provider value={contentWidth}>
      <PageToolkitProvider>
        <StacksProvider spacing={5}>
          <SafeAreaProvider>
            <ColorSchemeProvider
              initialColorScheme={initialColorScheme ?? 'light'}>
              <ThemeProvider>
                <UILinkPressDisplayMolecule>
                  <Navigation />
                  <StatusBar style="light" />
                </UILinkPressDisplayMolecule>
              </ThemeProvider>
            </ColorSchemeProvider>
          </SafeAreaProvider>
        </StacksProvider>
      </PageToolkitProvider>
    </contentWidthContextNucleon.Provider>
  );
}
