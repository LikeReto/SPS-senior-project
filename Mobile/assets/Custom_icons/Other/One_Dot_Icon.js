import React from 'react';
import Svg, { Circle } from 'react-native-svg';

const DotIcon = ({ size = 24, color = "currentColor" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12.1" cy="12.1" r="1" />
    </Svg>
  );
};

export default DotIcon;
