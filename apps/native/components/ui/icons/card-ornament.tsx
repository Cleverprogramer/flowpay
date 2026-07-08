import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const CardOrnament = (props: SvgProps) => (
  <Svg width={129} height={95} viewBox="0 0 129 95" fill="none" {...props}>
    <Path
      d="M77 -5C77.7631 -5 78.5235 -4.99186 79.2812 -4.97754C72.7421 2.37172 69 10.9021 69 20C69 47.1185 102.248 69.1927 143.718 69.9766C130.409 84.934 105.515 95 77 95C34.4741 95 0 72.6142 0 45C0 17.3858 34.4741 -5 77 -5ZM146 -30C188.526 -30 223 -7.61424 223 20C223 47.6142 188.526 70 146 70C145.237 70 144.476 69.9909 143.718 69.9766C150.257 62.6273 154 54.0979 154 45C154 17.8813 120.752 -4.19402 79.2812 -4.97754C92.59 -19.935 117.485 -30 146 -30Z"
      fill={props.color || "#fff"}
      fillOpacity={0.2}
    />
  </Svg>
);
