import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AlignLeftIcon = ({ size = 24, fill, color = "currentColor", className = "" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? color : "none"}
      stroke={fill ? 'none' : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <Path d="M15 12H3" />
      <Path d="M17 18H3" />
      <Path d="M21 6H3" />
    </Svg>
  );
};

export default AlignLeftIcon;
