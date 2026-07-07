import React from "react";
import Svg, { Rect, Path } from "react-native-svg";
import { theme } from "../theme";

// A simple hospital building with a cross — unambiguous "hospital/clinical" mark.
export default function Logo({ size = 32, color = theme.blue }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 40 40" fill="none">
      <Rect x="0" y="0" width="40" height="40" rx="10" fill={color} />
      {/* roof */}
      <Path d="M9 17 L20 9 L31 17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* building body */}
      <Rect x="10.5" y="17" width="19" height="14" rx="1.5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
      {/* cross */}
      <Path d="M20 21V27M17 24H23" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}


