import { Text, View } from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MarkedDates } from "./../../../../interfaces/Training";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import TrainingSession from "./TrainingSession";
import ViewLoading from "../../elements/ViewLoading";
import { TrainingByDateDetails } from "./../../../../interfaces/Training";
import { Message } from "./../../../../enums/Message";
import BackgroundMainSection from "../../elements/BackgroundMainSection";
import { useHomeContext } from "../HomeContext";
import { useAppContext } from "../../../AppContext";
import React from "react";
import {
  usePostApiIdGetTrainingByDate,
  useGetApiIdGetTrainingDates,
} from "../../../../api/generated/training/training";
import {
  TrainingByDateDetailsDto,
} from "../../../../api/generated/model";
import { BodyParts } from "../../../../enums/BodyParts";
import { WeightUnits } from "../../../../enums/Units";
import { useTranslation } from "react-i18next";

const History: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const calendar = useRef(null);
  const [trainings, setTrainings] = useState<TrainingByDateDetails[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const { mutateAsync: getTrainingByDateMutation } =
    usePostApiIdGetTrainingByDate();
  const { data: trainingDatesData } = useGetApiIdGetTrainingDates(userId, {
    query: { enabled: !!userId },
  });

  const trainingDates = useMemo(() => {
    if (!trainingDatesData?.data) return [];
    return (trainingDatesData.data as any[]).map((date: any) => ({
      date: date,
      dots: [{ color: "#94e798" }],
    }));
  }, [trainingDatesData]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setViewLoading(true);
    const initialDateObj = { _d: new Date() };
    await getTrainingByDate(initialDateObj);
    setViewLoading(false);
  };

  const getTrainingByDate = async (dateObject: any): Promise<void> => {
    const date: Date = new Date(dateObject._d);
    if (!date) return;
    setViewLoading(true);
    try {
      const result = await getTrainingByDateMutation({
        id: userId,
        data: { createdAt: date.toISOString() },
      });
      
      const mappedTrainings: TrainingByDateDetails[] = (
        result.data as TrainingByDateDetailsDto[]
      ).map((dto) => ({
        _id: dto._id || "",
        type: dto.type || "",
        createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
        planDay: {
          name: dto.planDay?.name || "",
        },
        gym: dto.gym || "",
        exercises:
          dto.exercises?.map((exercise) => ({
            exerciseScoreId: exercise.exerciseScoreId || "",
            scoresDetails:
              exercise.scoresDetails?.map((score) => ({
                _id: score._id || undefined,
                weight: score.weight || 0,
                unit: (score.unit?.displayName as WeightUnits) || WeightUnits.KILOGRAMS,
                reps: score.reps || 0,
                exercise: score.exercise || "",
                series: score.series || 0,
              })) || [],
            exerciseDetails: {
              _id: exercise.exerciseDetails?._id || "",
              name: exercise.exerciseDetails?.name || "",
              bodyPart: (exercise.exerciseDetails?.bodyPart?.displayName as BodyParts) || BodyParts.Chest,
            },
          })) || [],
      }));

      setTrainings(mappedTrainings);
    } catch (error) {
      setTrainings([]);
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full p-4">
        <ReactNativeCalendarStrip
          onDateSelected={getTrainingByDate}
          ref={calendar}
          selectedDate={new Date()}
          iconLeftStyle={{
            height: 15,
            width: 15,
          }}
          iconRightStyle={{
            height: 15,
            width: 15,
          }}
          markedDates={trainingDates}
          scrollable
          style={{ width: "100%", height: 150 }}
          dayContainerStyle={{
            backgroundColor: "rgb(40, 40, 40)",
            borderRadius: 8,
            padding: 4,
          }}
          calendarHeaderStyle={{
            color: "white",
            fontSize: 22,
            paddingBottom: 16,
          }}
          dateNumberStyle={{ color: "#5A5A5A", fontSize: 16 }}
          dateNameStyle={{ color: "#5A5A5A", fontSize: 14 }}
          highlightDateContainerStyle={{
            backgroundColor: "#20BC2D",
          }}
          highlightDateNumberContainerStyle={{
            backgroundColor: "#20BC2D",
          }}
          highlightDateNameStyle={{
            fontSize: 14,
          }}
          highlightDateNumberStyle={{
            fontSize: 16,
          }}
          iconContainer={{
            height: 30,
            width: 30,
            backgroundColor: "#20BC2D",
            borderRadius: 4,
          }}
          numDaysInWeek={5}
        />
        {viewLoading ? (
          <ViewLoading />
        ) : trainings && trainings.length ? (
          <TrainingSession trainings={trainings} />
        ) : (
          <View className="flex justify-center w-full h-1/2 items-center p-4">
            <Text
              style={{ fontFamily: "OpenSans_700Bold" }}
              className="text-textColor text-xl text-center"
            >
              {t('history.noSessionForDay')}
            </Text>
          </View>
        )}
      </View>
    </BackgroundMainSection>
  );
};
export default History;
