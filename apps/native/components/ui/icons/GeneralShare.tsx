import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const GeneralShare = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 12L13.6 5V8.5C10.4 8.5 4 10.6 4 19C4 17.833 5.92 15.5 13.6 15.5V19L20 12Z"
      fill={props.color || "black"}
      stroke={props.color || "black"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
