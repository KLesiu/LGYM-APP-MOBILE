import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

import ViewLoading from "../elements/ViewLoading";
import { useTraineeNotes } from "../../services/traineeNotes/traineeNoteService";

const TrainerNotesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useTraineeNotes();

  const notes = [...(data?.data ?? [])].sort((left, right) => {
    const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
    return rightTime - leftTime;
  });

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg">
        <ViewLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.notesTab", "Notes")}
        </Text>
        <Text className="text-red-500 text-center">{t("trainer.notesLoadError", "Failed to load notes")}</Text>
        <Text onPress={() => refetch()} className="text-primaryColor text-center">{t("common.retry", "Retry")}</Text>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.notesTab", "Notes")}
        </Text>
        <Text className="text-textColor opacity-60 text-center">
          {t("trainer.noVisibleNotes", "No trainer notes are visible right now")}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
      <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
        {t("trainer.notesTab", "Notes")}
      </Text>

      {notes.map((note, index) => (
        <View key={note._id || `${note.title}-${index}`} className="bg-mainColor rounded-lg p-4" style={{ gap: 8 }}>
          <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
            <Text className="text-textColor text-base flex-1" style={{ fontFamily: "OpenSans_700Bold" }}>
              {note.title || t("trainer.noteFallbackTitle", "Trainer note")}
            </Text>
            {note.isPinned ? (
              <View className="bg-primaryColor px-3 py-1 rounded-full">
                <Text className="text-black text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {t("trainer.notePinned", "Pinned")}
                </Text>
              </View>
            ) : null}
          </View>

          <Text className="text-textColor opacity-80" style={{ fontFamily: "OpenSans_400Regular" }}>
            {note.content || t("trainer.noteEmptyContent", "No content")}
          </Text>

          <Text className="text-textColor opacity-50 text-xs" style={{ fontFamily: "OpenSans_400Regular" }}>
            {t("trainer.noteUpdatedAt", "Updated")}: {formatDate(note.lastUpdatedAt)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default TrainerNotesSection;
