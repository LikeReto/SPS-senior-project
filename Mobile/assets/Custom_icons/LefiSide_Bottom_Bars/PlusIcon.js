import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = ({ size = 24, color = "currentColor", className = "" }) => {
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
      <Path d="M5 12h14" />
      <Path d="M12 5v14" />
    </Svg>
  );
};

export default PlusIcon;
