import React from "react";
import { View, Text } from "react-native";
import { MainRecordsLast } from "../../../../interfaces/MainRecords";
import CustomButton, { ButtonSize } from "../../elements/CustomButton";
import RemoveIcon from "./../../../../img/icons/deleteIcon.svg";
import ProgressIcon from "./../../../../img/icons/progressIcon.svg";
import Card from "../../elements/Card";

interface RecordsItemProps {
  record: MainRecordsLast;
  updateSettedExerciseRecord: (exerciseId: string | undefined) => void;
  deleteDialogVisible: (visible: boolean, record: MainRecordsLast) => void;
}

const RecordsItem: React.FC<RecordsItemProps> = ({
  record,
  updateSettedExerciseRecord,
  deleteDialogVisible,
}) => {
  return (
    <Card>
      <View
        className="w-full"
      >
        <View className="flex flex-row justify-between">
          <Text
            style={{
              fontFamily: "OpenSans_700Bold",
            }}
            className="text-xl smallPhone:text-base font-bold text-primaryColor"
          >
            {record.exerciseDetails.name}
          </Text>
          <View style={{ gap: 16 }} className="flex flex-row">
            <CustomButton
              buttonStyleSize={ButtonSize.none}
              onPress={() =>
                updateSettedExerciseRecord(record.exerciseDetails._id)
              }
              customSlots={[
                <ProgressIcon stroke={"white"} height={24} width={24} />,
              ]}
            />
            <CustomButton
              buttonStyleSize={ButtonSize.none}
              onPress={() => deleteDialogVisible(true, record)}
              customSlots={[<RemoveIcon />]}
            />
          </View>
        </View>

        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-base smallPhone:text-sm text-textColor"
        >
          Weight: {record.weight} {record.unit}
        </Text>
        <Text
          style={{ fontFamily: "OpenSans_400Regular" }}
          className="text-base smallPhone:text-sm text-textColor"
        >
          Date: {new Date(record.date).toLocaleString()}
        </Text>
      </View>
    </Card>
  );
};

export default RecordsItem;
