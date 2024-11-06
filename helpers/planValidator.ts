import Exercise from "./../types/Exercise";

export function isValidExerciseArray(exercises:Exercise[]) {
  // Sprawdzenie czy exercises jest tablicą
  if (!Array.isArray(exercises)) {
    return false;
  }

  // Sprawdzenie struktury i typów danych w każdym elemencie tablicy
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    if (
      typeof exercise !== 'object' || 
      exercise === null || 
      !('name' in exercise) || 
      !('series' in exercise) || 
      !('reps' in exercise) || 
      typeof exercise.name !== 'string' || 
      typeof exercise.reps !== 'string' ||
      isNaN(exercise.series) ||
      /\d/.test(exercise.name) || // Sprawdzenie czy w polu name występują cyfry
      exercise.reps.trim() === "" // Sprawdzenie czy pole reps nie jest puste
    ) {
      return false;
    }
  }

  // Jeśli wszystkie sprawdzenia przeszły pomyślnie, zwracamy true
  return true;
}




  