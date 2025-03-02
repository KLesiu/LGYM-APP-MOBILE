import { Circle, RoundedRect, Text as SText } from "@shopify/react-native-skia";
import React from "react";
import { SharedValue } from "react-native-reanimated";

interface ToolTipProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  value: SharedValue<string>;
  date: SharedValue<string>;
  font: any;
}

const ToolTip: React.FC<ToolTipProps> = ({ x, y, value, date, font }) => {
  return (
    <>
      <Circle cx={x} cy={y} color={"grey"} opacity={0.8} r={8} />
      <RoundedRect
        x={x}
        y={y.value - 40}
        width={100}
        height={40}
        r={8}
        color="black"
        opacity={0.8}
      />
      <SText
        x={x.value + 5}
        y={y.value - 25}
        text={`${value.value}`}
        color="white"
        font={font}
      />
      <SText
        x={x.value + 5}
        y={y.value - 10}
        text={date.value}
        color="white"
        font={font}
      />
    </>
  );
};

export default ToolTip;
