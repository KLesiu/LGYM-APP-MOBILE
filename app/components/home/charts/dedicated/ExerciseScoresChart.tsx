import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LineChart from "../templates/LineChart";
import { ExerciseForm } from "../../../../../interfaces/Exercise";
import { DropdownItem } from "./../../../../../interfaces/Dropdown";
import { View, Text } from "react-native";
import AutoComplete from "../../../elements/Autocomplete";
import { ExerciseScoresChartData } from "./../../../../../interfaces/ExercisesScores";
import { useHomeContext } from "../../HomeContext";
import { useAppContext } from "../../../../AppContext";

const ExerciseScoresChart: React.FC = () => {
  const { userId } = useHomeContext();
  const { getAPI, postAPI } = useAppContext();
  const [data, setData] = useState([]);
  const [exercisesToSelect, setExercisesToSelect] = useState<DropdownItem[]>(
    []
  );
  const [selectedExercise, setSelectedExercise] = useState<DropdownItem>();
  const [clearQuery, setClearQuery] = useState<boolean>(false);

  useEffect(() => {
    getAllExercises();
  }, []);

  const getAllExercises = async () => {
    await getAPI(
      `/exercise/${userId}/getAllExercises`,
      (result: ExerciseForm[]) => {
        const helpExercisesToSelect = result.map((exercise: ExerciseForm) => {
          return { label: exercise.name, value: exercise._id! };
        });
        setExercisesToSelect(helpExercisesToSelect);
        selectExercise(helpExercisesToSelect[0]);
      },
      undefined,
      false
    );
  };
  const clearAutoCompleteQuery = () => {
    setClearQuery(false);
  };
  const selectExercise = async (exercise: DropdownItem) => {
    setSelectedExercise(exercise);
    await getExerciseScoresChartData(exercise.value);
  };
  const getExerciseScoresChartData = async (exerciseId: string) => {
    await postAPI(
      `/exerciseScores/${userId}/getExerciseScoresChartData`,
      (result: ExerciseScoresChartData[]) => {
        const formattedData = result.map((item: ExerciseScoresChartData) => ({
          date: item.date,
          value: item.value,
        }));
        setData(formattedData as never[]);
      },
      { exerciseId: exerciseId }
    );
  };

  return (
    <View className="w-full flex flex-col" style={{ gap: 16 }}>
      <View className="flex flex-col w-full">
        <Text
          style={{ fontFamily: "OpenSans_300Light" }}
          className="  text-white  text-base"
        >
          Exercise:
        </Text>
        <AutoComplete
          data={exercisesToSelect}
          onSelect={(item) => selectExercise(item)}
          value={selectedExercise?.label || ""}
          valueId={selectedExercise?.value || ""}
          onClearQuery={clearQuery ? clearAutoCompleteQuery : undefined}
        />
      </View>
      {data.length ? (
        <View className="h-60 w-full">
          <LineChart data={data} />
        </View>
      ) : null}
    </View>
  );
};

export default ExerciseScoresChart;
