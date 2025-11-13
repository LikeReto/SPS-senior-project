import React from 'react';
import Svg, { Polygon } from 'react-native-svg';

const PlayVideoIcon = ({ size = 24, color = "currentColor", className = "" }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
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
            <Polygon points="6 3 20 12 6 21 6 3" />
        </Svg>
    );
};

export default PlayVideoIcon;
