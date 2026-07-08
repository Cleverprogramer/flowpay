import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const GeneralMaintenan = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 16 16" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.3335 1.33334C7.54262 1.33334 9.3335 3.12422 9.3335 5.33334C9.3335 5.73744 9.27356 6.12753 9.16212 6.49525L13.3335 10.6667C14.0699 11.4031 14.0699 12.597 13.3335 13.3333C12.5971 14.0697 11.4032 14.0697 10.6668 13.3333L6.4954 9.16197C6.12768 9.27341 5.73759 9.33334 5.3335 9.33334C3.12437 9.33334 1.3335 7.54247 1.3335 5.33334C1.3335 4.90703 1.40018 4.49628 1.52371 4.111L3.41584 6L5.29128 5.37541L5.37503 5.29166L6.00015 3.41797L4.10584 1.52531C4.49265 1.40069 4.90521 1.33334 5.3335 1.33334Z"
      fill={props.color || "black"}
    />
  </Svg>
);
