import * as React from "react";
import Svg, { Path, G, Mask } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const GeneralChecklist2 = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="mask0_4_2845"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="2"
      y="2"
      width="20"
      height="20"
    >
      <Path
        d="M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 12L11 15L16 10"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Mask>
    <G mask="url(#mask0_4_2845)">
      <Path d="M24 0H0V24H24V0Z" fill={props.color || "black"} />
    </G>
  </Svg>
);
