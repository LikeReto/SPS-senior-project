import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MoveRightIcon = ({ size = 24, color = "currentColor", className = "" }) => {
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
      className={className}
    >
      <Path d="M18 8L22 12L18 16" />
      <Path d="M2 12H22" />
    </Svg>
  );
};

export default MoveRightIcon;
