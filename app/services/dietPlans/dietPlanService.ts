import { useQuery } from "@tanstack/react-query";
import { customInstance } from "../../../api/custom-instance";

export type DietMealDto = {
  _id?: string | null;
  name?: string | null;
  order?: number;
  description?: string | null;
  estimatedCalories?: number | null;
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fatGrams?: number | null;
};

export type DietPlanDto = {
  _id?: string | null;
  trainerId?: string | null;
  traineeId?: string | null;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  estimatedCalories?: number | null;
  proteinGrams?: number | null;
  carbsGrams?: number | null;
  fatGrams?: number | null;
  notes?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  meals?: DietMealDto[] | null;
};

export type GetCurrentDietPlanResponse = {
  data: DietPlanDto;
  status: number;
  headers: Headers;
};

export type GetCurrentDietPlansResponse = {
  data: DietPlanDto[];
  status: number;
  headers: Headers;
};

export const getCurrentDietPlans = async (): Promise<GetCurrentDietPlansResponse> =>
  customInstance<GetCurrentDietPlansResponse>("/api/trainee/diet-plans/current", {
    method: "GET",
  });

export const useCurrentDietPlans = () =>
  useQuery({
    queryKey: ["trainee-current-diet-plans"],
    queryFn: getCurrentDietPlans,
    refetchOnMount: "always",
  });

export const getCurrentDietPlan = async (): Promise<GetCurrentDietPlanResponse> =>
  customInstance<GetCurrentDietPlanResponse>("/api/trainee/diet-plan/current", {
    method: "GET",
  });

export const useCurrentDietPlan = () =>
  useQuery({
    queryKey: ["trainee-current-diet-plan"],
    queryFn: getCurrentDietPlan,
    refetchOnMount: "always",
  });
