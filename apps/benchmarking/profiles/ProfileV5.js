import React from 'react';
import RenderHtmlv5 from 'react-native-render-html-v5';

export default function ProfileV5({ running, ignoredTags, html, tagsStyles, classesStyles }) {
  return (
    html &&
    running && (
      <RenderHtmlv5
        ignoredTags={ignoredTags}
        source={{ html }}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
      />
    )
  );
}
