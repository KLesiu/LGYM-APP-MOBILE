import type {
  ExerciseResponseDto,
  EnumLookupDto,
  GymFormDto,
  PlanDayBaseInfoDto,
  RankDto,
  UserInfoDto,
} from '../api/generated/model';
import type { DropdownItem } from '../interfaces/Dropdown';
import { Message } from '../enums/Message';

export type UserInfo = UserInfoDto;

export type ExerciseForm = Omit<ExerciseResponseDto, 'name' | '_id' | 'user' | 'bodyPart' | 'description' | 'image'> & {
  name?: string | null | undefined;
  _id?: string | null | undefined;
  user?: string | null | undefined;
  bodyPart?: EnumLookupDto | undefined;
  description?: string | null | undefined;
  image?: string | null | undefined;
};

export type GymForm = Omit<GymFormDto, 'name' | 'address' | '_id'> & {
  name?: string | null | undefined;
  address?: string | null | undefined;
  _id?: string | null | undefined;
};

export type PlanDayBaseInfoVm = PlanDayBaseInfoDto;
export interface PlanForm {
  _id?: string | undefined;
  name: string;
  isActive?: boolean | undefined;
  shareCode?: string | undefined;
}

export interface EnrichedExercise {
  exerciseScoreId: string;
  scoresDetails: {
    _id?: string;
    weight: number;
    unit: string;
    reps: number;
    exercise: string;
    series: number;
  }[];
  exerciseDetails: {
    _id: string;
    name: string;
    bodyPart: string;
  };
}

export interface TrainingByDateDetails {
  _id: string;
  type: string;
  createdAt: Date;
  planDay: {
    name: string;
  };
  gym: string;
  exercises: EnrichedExercise[];
}

export interface SeriesComparison {
  series: number;
  currentResult: {
    reps: number;
    weight: number;
    unit: string;
  };
  previousResult: {
    reps: number;
    weight: number;
    unit: string;
  } | null;
}

export interface TrainingSummary {
  comparison: {
    exerciseId: string;
    exerciseName: string;
    seriesComparisons: SeriesComparison[];
  }[];
  gainElo: number;
  userOldElo: number;
  profileRank: RankDto;
  nextRank: RankDto | null;
  msg: Message;
}

export interface ExerciseForPlanDay {
  series: number;
  reps: string;
  exercise: DropdownItem;
}

export interface PlanDayExercisesFormVm {
  series: number;
  reps: string;
  exercise: ExerciseForm;
}

export interface PlanDayVm {
  _id: string;
  name: string;
  exercises: PlanDayExercisesFormVm[];
}

export interface TrainingSessionScores {
  exercise: ExerciseForm;
  series: number;
  reps: string;
  weight: string;
}
