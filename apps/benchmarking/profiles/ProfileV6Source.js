import React from 'react';
import { useWindowDimensions } from 'react-native';
import { RenderHTMLSource, TRenderEngineProvider } from '@native-html/render';

export default function ProfileV6Source({ running, html, ignoredDomTags, ...otherProps }) {
  const { width } = useWindowDimensions();

  if (!html || !running) {
    return null;
  }

  const content = (
    <RenderHTMLSource
      contentWidth={width}
      source={{ html }}
      {...otherProps}
    />
  );

  // If ignoredDomTags is provided, wrap in a TRenderEngineProvider
  if (ignoredDomTags) {
    return (
      <TRenderEngineProvider ignoredDomTags={ignoredDomTags}>
        {content}
      </TRenderEngineProvider>
    );
  }

  return content;
}
