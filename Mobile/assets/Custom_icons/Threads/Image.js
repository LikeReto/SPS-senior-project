import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const ImagesIcon = ({ size = 24, color = "currentColor" }) => {
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
      <Path d="M18 22H4a2 2 0 0 1-2-2V6" />
      <Path d="M22 13l-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
      <Circle cx="12" cy="8" r="2" />
      <Rect x="6" y="2" width="16" height="16" rx="2" />
    </Svg>
  );
};

export default ImagesIcon;
