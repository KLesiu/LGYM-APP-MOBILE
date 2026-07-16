interface DisplayableExercise {
  displayName?: string | null;
  name?: string | null;
}

export const getExerciseDisplayName = (
  exercise?: DisplayableExercise | null
): string => exercise?.displayName || exercise?.name || "";
