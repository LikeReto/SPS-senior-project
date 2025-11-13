import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChevronRight = ({ size = 24, color = "currentColor", className = "" }) => {
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
      <Path d="M9 18L15 12L9 6" />
    </Svg>
  );
};

export default ChevronRight;
