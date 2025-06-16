import { OpenSans_700Bold } from "@expo-google-fonts/open-sans";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";
import ToolTip from "../Tooltip";
import { EloRegistryBaseChart } from "../../../../../interfaces/EloRegistry";

interface LineChartProps {
  data: never[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const { state } = useChartPressState({ x: 0 as never, y: { value: 0 } });

  const value = useDerivedValue(() => {
    return state.y.value.value.value.toString();
  }, [state]);

  const date = useDerivedValue(() => {
    if (!data.length) return "";
    const date = state.x.value.value;
    return date;
  }, [state, data]);

  const font = useFont(OpenSans_700Bold, 12);
  const labelColor = "white";
  const lineColor = "#94e798";
  return (
    <CartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      domainPadding={{ top: 30 }}
      axisOptions={{
        font,
        labelColor,
        lineColor,
      }}
      chartPressState={state}
      children={({ points, chartBounds }) => {
        return (
          <>
            <Line
              points={points.value}
              color={"white"}
              strokeWidth={2}
              animate={{ duration: 500, type: "timing" }}
            />
            <Area
              points={points.value}
              y0={chartBounds.bottom}
              animate={{ type: "timing", duration: 500 }}
              children={
                <LinearGradient
                  start={vec(chartBounds.bottom, 50)}
                  end={vec(chartBounds.bottom, chartBounds.bottom)}
                  colors={[lineColor, "black"]}
                />
              }
            />
            <ToolTip
              x={state.x.position}
              y={state.y.value.position}
              value={value}
              date={date}
              font={font}
            />
          </>
        );
      }}
    />
  );
};

export default LineChart;
