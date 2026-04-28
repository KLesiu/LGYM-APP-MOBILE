import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { ExerciseForm } from '../../../../../types/models';
import { useHomeContext } from '../../HomeContext';
import { getErrorMessage, sanitize } from '../../../../../lib/domain/errorHandler';
import toastService from '../../../../services/toastService';
import {
  getGetApiExerciseGetAllGlobalExercisesQueryKey,
  getGetApiExerciseIdGetAllExercisesQueryKey,
  getGetApiExerciseIdGetAllUserExercisesQueryKey,
  usePostApiExerciseAddExercise,
  usePostApiExerciseIdAddUserExercise,
  usePostApiExerciseIdDeleteExercise,
  usePostApiExerciseUpdateExercise,
} from '../../../../../api/generated/exercise/exercise';
import {
  ExerciseFormDtoBodyPart,
  type ExerciseFormDto,
  type EnumLookupDto,
  type EnumLookupResponseDto,
} from '../../../../../api/generated/model';
import { useGetApiEnumsEnumType } from '../../../../../api/generated/enum/enum';

type UseExerciseFormParams = {
  form?: ExerciseForm;
  isGlobal?: boolean;
  isAdmin?: boolean;
  closeForm: () => void;
};

const toBodyPartValue = (value?: string | null) => {
  const allowed = Object.values(ExerciseFormDtoBodyPart);
  if (value && allowed.includes(value as ExerciseFormDtoBodyPart)) {
    return value as ExerciseFormDtoBodyPart;
  }

  return ExerciseFormDtoBodyPart.Unknown;
};

export const useExerciseForm = ({ form, isGlobal, isAdmin, closeForm }: UseExerciseFormParams) => {
  const { t } = useTranslation();
  const { userId } = useHomeContext();
  const queryClient = useQueryClient();

  const [exerciseName, setExerciseName] = useState<string>('');
  const [bodyPart, setBodyPart] = useState<EnumLookupDto | undefined>();
  const [description, setDescription] = useState<string | undefined>('');
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const createUserExerciseMutation = usePostApiExerciseIdAddUserExercise();
  const createGlobalExerciseMutation = usePostApiExerciseAddExercise();
  const updateExerciseMutation = usePostApiExerciseUpdateExercise();
  const deleteExerciseMutation = usePostApiExerciseIdDeleteExercise();

  const { data: bodyPartsData } = useGetApiEnumsEnumType('BodyParts');

  useEffect(() => {
    if (form) {
      if (!form.user) {
        setIsBlocked(!isAdmin);
      }
      setExerciseName(form.name || '');
      setBodyPart(form.bodyPart || undefined);
      setDescription(form.description || '');
    }
  }, [form, isAdmin]);

  useEffect(() => () => {
    toastService.hide();
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!exerciseName || !bodyPart) {
      toastService.showValidationError(t('createExercise.nameAndBodyPartRequired'));
      return false;
    }

    return true;
  }, [bodyPart, exerciseName, t]);

  const refreshExerciseQueries = useCallback(async () => {
    const invalidatePromises: Promise<unknown>[] = [
      queryClient.invalidateQueries({ queryKey: getGetApiExerciseGetAllGlobalExercisesQueryKey() }),
      ...(userId
        ? [
            queryClient.invalidateQueries({ queryKey: getGetApiExerciseIdGetAllExercisesQueryKey(userId) }),
            queryClient.invalidateQueries({ queryKey: getGetApiExerciseIdGetAllUserExercisesQueryKey(userId) }),
          ]
        : []),
    ];

    await Promise.all(invalidatePromises);
  }, [queryClient, userId]);

  const submitExercise = useCallback(
    async (
      mutation: (payload: { data: ExerciseFormDto; id: string }) => Promise<unknown>,
      payload: ExerciseFormDto,
    ) => {
      try {
        if (!userId) return;
        await mutation({ id: userId, data: payload });
        await refreshExerciseQueries();
        closeForm();
      } catch (error) {
        const sanitizedError = sanitize(error);
        if (__DEV__ && sanitizedError.devDetails) {
          console.warn('[CreateExercise] submit failed', sanitizedError.devDetails);
        }
        toastService.showError(getErrorMessage(error, t('common.tryAgain')));
      }
    },
    [closeForm, refreshExerciseQueries, t, userId],
  );

  const createExercise = useCallback(async () => {
    if (!validateForm()) return;
    if (!userId) return;
    const payload: ExerciseFormDto = {
      name: exerciseName,
      bodyPart: toBodyPartValue(bodyPart?.name),
      ...(description ? { description } : {}),
    };
    await submitExercise(createUserExerciseMutation.mutateAsync, payload);
  }, [
    bodyPart?.name,
    createUserExerciseMutation.mutateAsync,
    description,
    exerciseName,
    submitExercise,
    userId,
    validateForm,
  ]);

  const createGlobalExercise = useCallback(async () => {
    if (!validateForm()) return;
    const payload: ExerciseFormDto = {
      name: exerciseName,
      bodyPart: toBodyPartValue(bodyPart?.name),
      ...(description ? { description } : {}),
    };
    await submitExercise(createGlobalExerciseMutation.mutateAsync, payload);
  }, [
    bodyPart?.name,
    createGlobalExerciseMutation.mutateAsync,
    description,
    exerciseName,
    submitExercise,
    validateForm,
  ]);

  const updateExercise = useCallback(async () => {
    if (!validateForm()) return;
    const payload: ExerciseFormDto = {
      name: exerciseName,
      bodyPart: toBodyPartValue(bodyPart?.name),
      ...(form?._id ? { _id: form._id } : {}),
      ...(description ? { description } : {}),
    };
    await submitExercise(updateExerciseMutation.mutateAsync, payload);
  }, [
    bodyPart?.name,
    description,
    exerciseName,
    form?._id,
    submitExercise,
    updateExerciseMutation.mutateAsync,
    validateForm,
  ]);

  const deleteExercise = useCallback(async () => {
    if (!form?._id) return;
    if (!userId) return;
    try {
      await deleteExerciseMutation.mutateAsync({ id: userId, data: { id: form._id } });
      await refreshExerciseQueries();
      closeForm();
    } catch (error) {
      const sanitizedError = sanitize(error);
      if (__DEV__ && sanitizedError.devDetails) {
        console.warn('[CreateExercise] delete failed', sanitizedError.devDetails);
      }
      toastService.showError(getErrorMessage(error, t('common.tryAgain')));
    }
  }, [closeForm, deleteExerciseMutation.mutateAsync, form?._id, refreshExerciseQueries, t, userId]);

  const handleSubmit = useCallback(() => {
    if (isGlobal) void createGlobalExercise();
    else if (form) void updateExercise();
    else void createExercise();
  }, [createExercise, createGlobalExercise, form, isGlobal, updateExercise]);

  const bodyPartsToSelect = useMemo(() => {
    const responseData = bodyPartsData?.data as EnumLookupResponseDto;
    if (responseData && responseData.values) {
      return responseData.values.map((item: EnumLookupDto) => ({
        label: item.displayName || item.name || '',
        value: item.name || '',
      }));
    }
    return [];
  }, [bodyPartsData]);

  return {
    exerciseName,
    setExerciseName,
    bodyPart,
    setBodyPart,
    description,
    setDescription,
    isBlocked,
    bodyPartsToSelect,
    isLoading:
      createUserExerciseMutation.isPending ||
      createGlobalExerciseMutation.isPending ||
      updateExerciseMutation.isPending ||
      deleteExerciseMutation.isPending,
    handleSubmit,
    deleteExercise,
  };
};
