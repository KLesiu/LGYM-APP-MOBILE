import React, { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Dialog from "../../elements/Dialog";
import CustomButton, { ButtonStyle } from "../../elements/CustomButton";
import ValidationView from "../../elements/ValidationView";
import CustomDropdown from "../../elements/Dropdown";
import { ExerciseResponseDto } from "../../../../api/generated/model";
import { DropdownItem } from "../../../../interfaces/Dropdown";

interface ExerciseTranslationDialogProps {
  exercise: ExerciseResponseDto;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (data: { culture: string; name: string }) => Promise<void>;
}

const ExerciseTranslationDialog: React.FC<ExerciseTranslationDialogProps> = ({
  exercise,
  isSaving,
  onCancel,
  onSubmit,
}) => {
  const { t, i18n } = useTranslation();
  const initialCulture = i18n.language?.startsWith("pl") ? "pl" : "en";
  const [culture, setCulture] = useState(initialCulture);
  const [translatedName, setTranslatedName] = useState("");

  const languageOptions = useMemo<DropdownItem[]>(
    () => [
      { label: "Polski (pl)", value: "pl" },
      { label: "English (en)", value: "en" },
    ],
    []
  );

  const canSubmit = useMemo(() => {
    return culture.trim().length > 0 && translatedName.trim().length > 0;
  }, [culture, translatedName]);

  const submit = async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmit({
      culture: culture.trim(),
      name: translatedName.trim(),
    });
  };

  return (
    <Dialog>
      <View className="w-full h-full">
        <View className="px-5 py-2" style={{ gap: 4 }}>
          <Text
            className="text-3xl smallPhone:text-2xl text-textColor"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {t("exercises.addTranslation")}
          </Text>
          <Text
            className="text-textColor"
            style={{ fontFamily: "OpenSans_300Light" }}
          >
            {exercise.name}
          </Text>
        </View>

        <View className="px-5" style={{ gap: 16 }}>
          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-textColor text-base smallPhone:text-sm"
              >
                {t("exercises.translationLanguage")}:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

            <CustomDropdown
              value={culture}
              data={languageOptions}
              onSelect={(item) => setCulture(item?.value || "")}
            />
          </View>

          <View style={{ gap: 4 }} className="flex flex-col">
            <View className="flex flex-row gap-1">
              <Text
                style={{ fontFamily: "OpenSans_300Light" }}
                className="text-textColor text-base smallPhone:text-sm"
              >
                {t("exercises.translationName")}:
              </Text>
              <Text className="text-redColor">*</Text>
            </View>

            <TextInput
              style={{
                fontFamily: "OpenSans_400Regular",
                backgroundColor: "rgb(30, 30, 30)",
                borderRadius: 8,
              }}
              className="w-full px-2 py-4 text-textColor"
              onChangeText={setTranslatedName}
              value={translatedName}
              autoCorrect={false}
              placeholderTextColor="rgb(125,125,125)"
            />
          </View>
        </View>

        <View className="p-5 flex flex-row justify-between" style={{ gap: 20 }}>
          <CustomButton
            onPress={onCancel}
            text={t("common.cancel")}
            buttonStyleType={ButtonStyle.outlineBlack}
            width="flex-1"
            disabled={isSaving}
          />
          <CustomButton
            onPress={submit}
            text={t("common.add")}
            buttonStyleType={ButtonStyle.success}
            width="flex-1"
            disabled={isSaving || !canSubmit}
          />
        </View>
        <ValidationView />
      </View>
    </Dialog>
  );
};

export default ExerciseTranslationDialog;
