import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import html from './source';
import {
  TRenderEngineProvider,
  RenderHTMLConfigProvider
} from 'react-native-render-html';

import Benchmark from './Benchmark';

const config = {
  samples: 50,
  ignoredTags: ['svg', 'button', 'input', 'form', 'img', 'ol', 'table']
};

const props = {
  renderers: {}
};

export default function App() {
  useKeepAwake();
  return (
    <SafeAreaView style={styles.container}>
      <TRenderEngineProvider ignoredDomTags={config.ignoredTags}>
        <RenderHTMLConfigProvider {...props}>
          <Benchmark html={html} {...config} />
        </RenderHTMLConfigProvider>
      </TRenderEngineProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
