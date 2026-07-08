import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";

export const GeneralEdit = (props: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 20H21"
      stroke={props.color || "#1C3E38"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z"
      fill={props.color || "#1C3E38"}
      stroke={props.color || "#1C3E38"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
