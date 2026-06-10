import React from 'react';
import { renderHook, render } from '@testing-library/react-native';
import useIMGElementState from '../useIMGElementState';
import { Image } from 'react-native';
import { waitFor } from '@testing-library/react-native';

function renderHookForPerf(renderFn: () => void) {
  let renderCount = 0;
  function TestComponent() {
    renderCount++;
    renderFn();
    return null;
  }
  const utils = render(React.createElement(TestComponent));
  return { ...utils, getRenderCount: () => renderCount };
}

describe('useIMGElementState', () => {
  const props = {
    contentWidth: 300,
    source: { uri: 'https://foo.bar/600x300' },
    initialDimensions: { width: 30, height: 30 },
    computeMaxWidth: (contentWidth: number) => contentWidth
  };
  it('should render at most twice when width and height physical dimensions are not provided, prior and after fetching physical dimensions', async () => {
    const { getRenderCount } = renderHookForPerf(() => useIMGElementState(props));
    await waitFor(() => {
      expect(getRenderCount()).toBeLessThan(2);
    });
  });
  it('should use Image.getSizeWithHeaders when source has `headers`', async () => {
    const source = { uri: 'http://via.placeholder.com/640x360', headers: {} };
    const localProps = { ...props, source };
    const { getRenderCount } = renderHookForPerf(() => useIMGElementState(localProps));
    await waitFor(() => {
      expect(getRenderCount()).toBeLessThan(2);
    });
    expect(Image.getSizeWithHeaders).toHaveBeenCalled();
  });
  it('should render once when width and height physical dimensions are provided, bypassing the fetching of physical dimensions', async () => {
    const { getRenderCount } = renderHookForPerf(() =>
      useIMGElementState({
        ...props,
        width: 600,
        height: 300
      })
    );
    await waitFor(() => {
      expect(getRenderCount()).toBe(1);
    });
  });
  it('should start in loading state with dimensions set to initialDimensions', async () => {
    const { result } = renderHook(() => useIMGElementState(props));
    expect(result.current.type).toEqual('loading');
    expect(result.current.dimensions).toMatchObject({
      width: 30,
      height: 30
    });
  });
  it('should update to success state with dimensions set to scaled physical image dimensions', async () => {
    const { result } = renderHook(() => useIMGElementState(props));
    await waitFor(() => expect(result.current.type).toEqual('success'));
    expect(result.current.dimensions).toMatchObject({
      width: 300,
      height: 150
    });
  });
  it('should support cachedNaturalDimensions prop', async () => {
    Image.getSizeWithHeaders = jest.fn();
    const { result } = renderHook(() =>
      useIMGElementState({
        ...props,
        cachedNaturalDimensions: {
          width: 600,
          height: 300
        }
      })
    );
    expect(result.current.type).toEqual('success');
    expect(result.current.dimensions).toMatchObject({
      width: 300,
      height: 150
    });
    expect(Image.getSizeWithHeaders).not.toHaveBeenCalled();
  });
});
