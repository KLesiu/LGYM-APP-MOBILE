import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface HistoryMonthPickerModalProps {
  visible: boolean;
  visibleMonthTitle: string;
  weekdayLabels: string[];
  monthGridDays: Array<Date | null>;
  selectedDateKey: string;
  trainingDateKeys: Set<string>;
  closeLabel: string;
  onClose: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDaySelect: (date: Date) => void;
  toDateKey: (date: Date) => string;
}

const HistoryMonthPickerModal: React.FC<HistoryMonthPickerModalProps> = ({
  visible,
  visibleMonthTitle,
  weekdayLabels,
  monthGridDays,
  selectedDateKey,
  trainingDateKeys,
  closeLabel,
  onClose,
  onPrevMonth,
  onNextMonth,
  onDaySelect,
  toDateKey,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-4">
        <View
          className="w-full max-w-[360px] rounded-xl bg-[#282828] p-4"
          style={{ gap: 12 }}
        >
          <View className="w-full flex-row items-center justify-between">
            <TouchableOpacity
              className="h-8 w-8 items-center justify-center rounded-md bg-[#1f1f1f]"
              onPress={onPrevMonth}
            >
              <Text className="text-textColor text-xl">{"<"}</Text>
            </TouchableOpacity>
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-textColor text-lg"
            >
              {visibleMonthTitle}
            </Text>
            <TouchableOpacity
              className="h-8 w-8 items-center justify-center rounded-md bg-[#1f1f1f]"
              onPress={onNextMonth}
            >
              <Text className="text-textColor text-xl">{">"}</Text>
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row justify-between">
            {weekdayLabels.map((label) => (
              <Text
                key={label}
                style={{ fontFamily: "OpenSans_700Bold" }}
                className="w-[13.5%] text-center text-[#7D7D7D]"
              >
                {label}
              </Text>
            ))}
          </View>

          <View className="w-full flex-row flex-wrap" style={{ rowGap: 8 }}>
            {monthGridDays.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} className="w-[14.28%] h-10" />;
              }

              const dateKey = toDateKey(date);
              const isSelected = dateKey === selectedDateKey;
              const isTrainingDay = trainingDateKeys.has(dateKey);

              return (
                <View
                  key={dateKey}
                  className="w-[14.28%] h-10 items-center justify-center"
                >
                  <TouchableOpacity
                    onPress={() => onDaySelect(date)}
                    className={`h-9 w-9 flex items-center justify-center rounded-md ${
                      isSelected ? "bg-primaryColor" : "bg-[#1f1f1f]"
                    }`}
                  >
                    <Text
                      style={{
                        fontFamily: isSelected
                          ? "OpenSans_700Bold"
                          : "OpenSans_400Regular",
                      }}
                      className={`text-sm ${
                        isSelected ? "text-black" : "text-textColor"
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                    {isTrainingDay && (
                      <View
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-black" : "bg-[#94e798]"
                        }`}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="w-full h-10 items-center justify-center rounded-md bg-[#1f1f1f]"
          >
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-textColor text-base"
            >
              {closeLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HistoryMonthPickerModal;
