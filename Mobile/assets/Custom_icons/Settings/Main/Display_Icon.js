import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const DisplayIcon = ({ size = 24, fill, color = "currentColor" }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? color : "none"}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6a6 6 0 0 1 0 12V6z" />
    </Svg>
  );
};

export default DisplayIcon;
