import * as React from "react";
import Svg, { Path, G, Mask } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const GeneralSetting = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Mask
      id="mask0_4090_5840"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="1"
      y="2"
      width="22"
      height="20"
    >
      <Path
        d="M17 20.5L22 12L17 3.5H7L2 12L7 20.5H17Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14.5C12.663 14.5 13.2989 14.2366 13.7678 13.7678C14.2366 13.2989 14.5 12.663 14.5 12C14.5 11.337 14.2366 10.7011 13.7678 10.2322C13.2989 9.76339 12.663 9.5 12 9.5C11.337 9.5 10.7011 9.76339 10.2322 10.2322C9.76339 10.7011 9.5 11.337 9.5 12C9.5 12.663 9.76339 13.2989 10.2322 13.7678C10.7011 14.2366 11.337 14.5 12 14.5Z"
        fill={props.color || "black"}
        stroke={props.color || "black"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Mask>
    <G mask="url(#mask0_4090_5840)">
      <Path d="M0 0H24V24H0V0Z" fill={props.color || "black"} />
    </G>
  </Svg>
);
