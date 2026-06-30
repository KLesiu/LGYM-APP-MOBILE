import { useQuery } from "@tanstack/react-query";
import { customInstance } from "../../../api/custom-instance";

export type TraineeNoteDto = {
  _id?: string | null;
  trainerId?: string | null;
  traineeId?: string | null;
  title?: string | null;
  content?: string | null;
  visibleToTrainee?: boolean;
  isPinned?: boolean;
  lastUpdatedByUserId?: string | null;
  lastUpdatedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type GetTraineeNotesResponse = {
  data: TraineeNoteDto[];
  status: number;
  headers: Headers;
};

export const getTraineeNotes = async (): Promise<GetTraineeNotesResponse> =>
  customInstance<GetTraineeNotesResponse>("/api/trainee/notes", {
    method: "GET",
  });

export const useTraineeNotes = () =>
  useQuery({
    queryKey: ["trainee-visible-notes"],
    queryFn: getTraineeNotes,
  });
