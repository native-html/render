import React from 'react';
import { renderHook, render } from '@testing-library/react-native';
import { perf, wait } from 'react-performance-testing/native';
import useIMGElementState from '../useIMGElementState';
import { Image } from 'react-native';
import { waitFor } from '@testing-library/react-native';

/**
 * Renders the hook inside a named component to allow extracting perf results
 */
function renderHookForPerf(renderFn: () => void) {
  function TestComponent() {
    renderFn();
    return null;
  }

  return render(React.createElement(TestComponent));
}

describe('useIMGElementState', () => {
  const props = {
    contentWidth: 300,
    source: { uri: 'https://foo.bar/600x300' },
    initialDimensions: { width: 30, height: 30 },
    computeMaxWidth: (contentWidth: number) => contentWidth
  };
  it('should render at most twice when width and height physical dimensions are not provided, prior and after fetching physical dimensions', async () => {
    const { renderCount } = perf<{ TestComponent: unknown }>(React);

    renderHookForPerf(() => useIMGElementState(props));
    await wait(() => {
      expect(renderCount.current.TestComponent.value).toBeLessThan(2);
    });
  });
  it('should use Image.getSizeWithHeaders when source has `headers`', async () => {
    const { renderCount } = perf<{ TestComponent: unknown }>(React);
    const source = { uri: 'http://via.placeholder.com/640x360', headers: {} };
    const localProps = { ...props, source };
    renderHookForPerf(() => useIMGElementState(localProps));
    await wait(() => {
      expect(renderCount.current.TestComponent.value).toBeLessThan(2);
    });
    expect(Image.getSizeWithHeaders).toHaveBeenCalled();
  });
  it('should render once when width and height physical dimensions are provided, bypassing the fetching of physical dimensions', async () => {
    const { renderCount } = perf<{ TestComponent: unknown }>(React);
    renderHookForPerf(() =>
      useIMGElementState({
        ...props,
        width: 600,
        height: 300
      })
    );
    await wait(() => {
      expect(renderCount.current.TestComponent.value).toBe(1);
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
