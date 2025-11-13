import React from 'react';
import Svg, { Polyline, Line } from 'react-native-svg';

const Minimize2Icon = ({ size = 24, color = "currentColor", className = "" }) => {
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
      <Polyline points="4 14 10 14 10 20" />
      <Polyline points="20 10 14 10 14 4" />
      <Line x1="14" y1="10" x2="21" y2="3" />
      <Line x1="3" y1="21" x2="10" y2="14" />
    </Svg>
  );
};

export default Minimize2Icon;
