import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import html from './source';
import {
  TRenderEngineProvider,
  RenderHTMLConfigProvider
} from '@native-html/render';

import Benchmark from './Benchmark';

const config = {
  samples: 50,
  ignoredTags: ['svg', 'button', 'input', 'form', 'img', 'ol', 'table']
};

export default function App() {
  useKeepAwake();
  return (
    <SafeAreaView style={styles.container}>
      <TRenderEngineProvider
        ignoredDomTags={config.ignoredTags}
        baseStyle={props.baseStyle}
        tagsStyles={props.tagsStyles}
        classesStyles={props.classesStyles}>
        <RenderHTMLConfigProvider renderers={props.renderers}>
          <Benchmark
            html={html}
            samples={config.samples}
            tagsStyles={props.tagsStyles}
            classesStyles={props.classesStyles}
          />
        </RenderHTMLConfigProvider>
      </TRenderEngineProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff'
  },
  baseStyle: {
    fontSize: 16,
    color: '#000000'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    backgroundColor: '#ffffff'
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#20232a'
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 14,
    color: '#20232a'
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#20232a'
  },
  p: {
    marginVertical: 8,
    fontSize: 16,
    lineHeight: 24
  },
  a: {
    color: '#61dafb',
    textDecorationLine: 'underline'
  },
  code: {
    backgroundColor: '#f5f5f5',
    fontFamily: 'monospace',
    padding: 2,
    borderRadius: 3
  },
  pre: {
    backgroundColor: '#282c34',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12
  },
  ul: {
    marginVertical: 8,
    paddingLeft: 20
  },
  ol: {
    marginVertical: 8,
    paddingLeft: 20
  },
  li: {
    marginVertical: 4
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#61dafb',
    paddingLeft: 16,
    marginVertical: 12,
    fontStyle: 'italic'
  },
  table: {
    marginVertical: 12
  },
  th: {
    fontWeight: 'bold',
    padding: 8,
    backgroundColor: '#f5f5f5'
  },
  td: {
    padding: 8
  },
  navbar: {
    backgroundColor: '#20232a',
    padding: 12
  },
  navbarBrand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#61dafb'
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  navbarLink: {
    color: '#ffffff',
    marginHorizontal: 8
  },
  menuLink: {
    color: '#20232a',
    padding: 8
  },
  menuLinkActive: {
    color: '#61dafb',
    fontWeight: 'bold'
  },
  docTitle1vX4: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16
  },
  markdown: {
    fontSize: 16,
    lineHeight: 24
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  button: {
    backgroundColor: '#61dafb',
    padding: 12,
    borderRadius: 6,
    color: '#20232a'
  },
  footer: {
    backgroundColor: '#20232a',
    padding: 24,
    marginTop: 32
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8
  },
  footerLinkItem: {
    color: '#61dafb',
    marginVertical: 4
  },
  tabs: {
    marginVertical: 12
  },
  tabsItem: {
    padding: 12,
    backgroundColor: '#f5f5f5'
  },
  tabsItemActive: {
    backgroundColor: '#61dafb',
    color: '#ffffff'
  }
});

const props = {
  renderers: {},
  baseStyle: styles.baseStyle,
  tagsStyles: {
    body: styles.body,
    h1: styles.h1,
    h2: styles.h2,
    h3: styles.h3,
    p: styles.p,
    a: styles.a,
    code: styles.code,
    pre: styles.pre,
    ul: styles.ul,
    ol: styles.ol,
    li: styles.li,
    blockquote: styles.blockquote,
    table: styles.table,
    th: styles.th,
    td: styles.td
  },
  classesStyles: {
    navbar: styles.navbar,
    navbar__brand: styles.navbarBrand,
    navbar__title: styles.navbarTitle,
    navbar__link: styles.navbarLink,
    menu__link: styles.menuLink,
    'menu__link--active': styles.menuLinkActive,
    docTitle_1vX4: styles.docTitle1vX4,
    markdown: styles.markdown,
    badge: styles.badge,
    button: styles.button,
    footer: styles.footer,
    footer__title: styles.footerTitle,
    'footer__link-item': styles.footerLinkItem,
    tabs: styles.tabs,
    tabs__item: styles.tabsItem,
    'tabs__item--active': styles.tabsItemActive
  }
};
