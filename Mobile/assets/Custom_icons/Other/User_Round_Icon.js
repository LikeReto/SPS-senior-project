import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const UserRoundIcon = ({ size = 24, fill, color = "currentColor" }) => {
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
    >
      <Circle cx="12" cy="8" r="5" />
      <Path d="M20 21a8 8 0 0 0-16 0" />
    </Svg>
  );
};

export default UserRoundIcon;
