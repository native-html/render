import React from 'react';
import useToolkit from '../toolkit/useToolkit';

const RefRNRH = ({}) => {
  const { RefLibrary } = useToolkit();
  return (
    <RefLibrary
      name="@native-html/render"
      url="https://github.com/native-html/render"
    />
  );
};

export default RefRNRH;
