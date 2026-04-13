import React from 'react';
import { render } from '@testing-library/react-native';
import RenderHTML from '../RenderHTML';

/**
 * https://github.com/native-html/render/pull/32
 */
describe('RenderHTML component', () => {
  describe('should pass regression #32 regarding anchor without href when baseUrl is provided', () => {
    it('should mount without throwing', () => {
      const { getByText } = render(
        <RenderHTML
          debug={false}
          source={{
            html: '<a>link label</a>',
            baseUrl: 'https://example.com/'
          }}
        />
      );
      expect(getByText('link label')).toBeTruthy();
    });
  });
});
