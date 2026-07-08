import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import ViewLoading from "../elements/ViewLoading";
import { useTraineeNotes, type TraineeNoteDto } from "../../services/traineeNotes/traineeNoteService";

const TrainerNotesSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useTraineeNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const notes = useMemo(() => {
    return [...(data?.data ?? [])].sort((left, right) => {
      if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
        return left.isPinned ? -1 : 1;
      }

      const leftTime = left.lastUpdatedAt ? new Date(left.lastUpdatedAt).getTime() : 0;
      const rightTime = right.lastUpdatedAt ? new Date(right.lastUpdatedAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }, [data?.data]);

  const selectedNote = useMemo(
    () => notes.find((note) => note._id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
  };

  const getPreviewText = (note: TraineeNoteDto) => {
    const content = note.content?.trim();
    if (!content) {
      return t("trainer.noteEmptyContent", "No content");
    }

    return content;
  };

  const closeNotePreview = () => setSelectedNoteId(null);

  if (isLoading) {
    return (
      <View className="bg-secondaryColor p-4 rounded-3xl border border-thirdColor" style={{ gap: 16 }}>
        <ViewLoading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-secondaryColor p-4 rounded-3xl border border-thirdColor" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.notesTab", "Notes")}
        </Text>
        <Text className="text-red-500 text-center">
          {t("trainer.notesLoadError", "Failed to load notes")}
        </Text>
        <Text onPress={() => refetch()} className="text-primaryColor text-center">
          {t("common.retry", "Retry")}
        </Text>
      </View>
    );
  }

  if (notes.length === 0) {
    return (
      <View className="bg-secondaryColor p-4 rounded-3xl border border-thirdColor" style={{ gap: 12 }}>
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
    <>
      <View className="bg-secondaryColor p-4 rounded-lg" style={{ gap: 12 }}>
        <Text className="text-primaryColor text-base" style={{ fontFamily: "OpenSans_700Bold" }}>
          {t("trainer.notesTab", "Notes")}
        </Text>

        <View className="flex-row flex-wrap justify-between" style={{ rowGap: 14 }}>
          {notes.map((note, index) => (
            <Pressable
              key={note._id || `${note.title}-${index}`}
              onPress={() => setSelectedNoteId(note._id || null)}
              className="rounded-[28px] border border-thirdColor bg-mainColor p-4"
              style={{ width: "48%", minHeight: 210, gap: 12 }}
            >
              <View className="flex-row items-start justify-between" style={{ gap: 8 }}>
                <Text
                  className="text-textColor text-base flex-1"
                  numberOfLines={2}
                  style={{ fontFamily: "OpenSans_700Bold" }}
                >
                  {note.title || t("trainer.noteFallbackTitle", "Trainer note")}
                </Text>
                {note.isPinned ? (
                  <View className="rounded-full bg-primaryColor/20 px-3 py-1">
                    <Text className="text-primaryColor text-[10px] uppercase" style={{ fontFamily: "OpenSans_700Bold" }}>
                      {t("trainer.notePinned", "Pinned")}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text
                className="text-textColor opacity-85 leading-7 flex-1"
                numberOfLines={6}
                style={{ fontFamily: "OpenSans_400Regular" }}
              >
                {getPreviewText(note)}
              </Text>

              <View style={{ gap: 4 }}>
                <Text className="text-textColor opacity-40 text-xs" style={{ fontFamily: "OpenSans_400Regular" }}>
                  {formatDate(note.lastUpdatedAt || note.updatedAt)}
                </Text>
                {note.visibleToTrainee ? (
                  <Text className="text-primaryColor text-xs" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.noteVisibleToTrainee", "Visible to you")}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <Modal visible={Boolean(selectedNote)} transparent animationType="fade" onRequestClose={closeNotePreview}>
        <View className="flex-1 justify-end bg-black/80 px-4 py-6">
          <View className="max-h-[88%] rounded-[32px] border border-thirdColor bg-secondaryColor px-5 py-5">
            <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
              <View className="flex-1" style={{ gap: 8 }}>
                <Text className="text-primaryColor text-xs uppercase tracking-[3px]" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {t("trainer.notesTab", "Notes")}
                </Text>
                <Text className="text-textColor text-2xl" style={{ fontFamily: "OpenSans_700Bold" }}>
                  {selectedNote?.title || t("trainer.noteFallbackTitle", "Trainer note")}
                </Text>
                <Text className="text-textColor opacity-55 text-sm" style={{ fontFamily: "OpenSans_400Regular" }}>
                  {t("trainer.noteUpdatedAt", "Updated")}: {formatDateTime(selectedNote?.lastUpdatedAt || selectedNote?.updatedAt)}
                </Text>
              </View>

              <Pressable onPress={closeNotePreview} className="h-10 w-10 items-center justify-center rounded-full bg-mainColor">
                <Text className="text-textColor text-xl" style={{ fontFamily: "OpenSans_700Bold" }}>
                  ×
                </Text>
              </Pressable>
            </View>

            <View className="mt-4 flex-row flex-wrap" style={{ gap: 8 }}>
              {selectedNote?.isPinned ? (
                <View className="rounded-full border border-primaryColor/40 bg-primaryColor/15 px-3 py-1">
                  <Text className="text-primaryColor text-xs uppercase" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.notePinned", "Pinned")}
                  </Text>
                </View>
              ) : null}

              {selectedNote?.visibleToTrainee ? (
                <View className="rounded-full border border-white/10 bg-mainColor px-3 py-1">
                  <Text className="text-textColor text-xs uppercase" style={{ fontFamily: "OpenSans_700Bold" }}>
                    {t("trainer.noteVisibleToTrainee", "Visible to you")}
                  </Text>
                </View>
              ) : null}
            </View>

            <ScrollView className="mt-5" showsVerticalScrollIndicator={false}>
              <Text className="text-textColor text-base leading-8" style={{ fontFamily: "OpenSans_400Regular" }}>
                {selectedNote?.content?.trim() || t("trainer.noteEmptyContent", "No content")}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TrainerNotesSection;
