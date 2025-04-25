import { useWindowDimensions } from "react-native";
import { DeviceCategory } from "../../enums/DeviceCategory";

const useDeviceCategory = (): DeviceCategory | null => {
  const { width, height } = useWindowDimensions();

  switch (true) {
    case width <= 360 && height <= 1280:
      return DeviceCategory.SMALL;
    case width <= 400 && height > 1280 && height <= 1600:
      return DeviceCategory.BUGDET;
    case width <= 430 && height > 1600 && height <= 2340:
      return DeviceCategory.MID;
    case width <= 450 && height > 2340 && height <= 2532:
      return DeviceCategory.LARGE;
    case width <= 480 && height > 2532 && height <= 2778:
      return DeviceCategory.MAX;
    case width > 480 && height > 2778:
      return DeviceCategory.ULTRA;
    default:
      return null;
  }
};

export default useDeviceCategory;
