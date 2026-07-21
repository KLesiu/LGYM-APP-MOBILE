import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export const APP_DISPLAY_NAME = "Training Hub";

interface BrandMarkProps {
  size?: number;
  showWordmark?: boolean;
  layout?: "horizontal" | "vertical";
  subtitle?: string;
}

const BrandMark: React.FC<BrandMarkProps> = ({
  size = 72,
  showWordmark = true,
  layout = "horizontal",
  subtitle,
}) => {
  const isVertical = layout === "vertical";

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={APP_DISPLAY_NAME}
      style={{
        alignItems: "center",
        flexDirection: isVertical ? "column" : "row",
        gap: isVertical ? 12 : 10,
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 256 256">
        <Rect width="256" height="256" rx="64" fill="#0F172A" />
        <Circle
          cx="128"
          cy="128"
          r="84"
          fill="#132238"
          stroke="#2DD4BF"
          strokeWidth="8"
        />
        <Path
          d="M72 94h112M88 76v36M168 76v36"
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <Path
          d="M96 118v66M160 118v66M96 151h64"
          fill="none"
          stroke="#2DD4BF"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M112 184h32"
          fill="none"
          stroke="#F8FAFC"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </Svg>

      {showWordmark && (
        <View style={{ alignItems: isVertical ? "center" : "flex-start" }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 5 }}>
            <Text
              style={{
                color: "#F8FAFC",
                fontFamily: "OpenSans_700Bold",
                fontSize: isVertical ? 24 : Math.max(14, size * 0.4),
                letterSpacing: 0.2,
              }}
            >
              Training
            </Text>
            <Text
              style={{
                color: "#2DD4BF",
                fontFamily: "OpenSans_700Bold",
                fontSize: isVertical ? 24 : Math.max(14, size * 0.4),
                letterSpacing: 0.2,
              }}
            >
              Hub
            </Text>
          </View>
          {subtitle ? (
            <Text
              style={{
                color: "#94A3B8",
                fontFamily: "OpenSans_400Regular",
                fontSize: 12,
                marginTop: 2,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default BrandMark;
