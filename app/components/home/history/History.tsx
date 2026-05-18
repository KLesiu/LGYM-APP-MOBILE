import { Text, View } from 'react-native';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactNativeCalendarStrip from 'react-native-calendar-strip';
import TrainingSession from './TrainingSession';
import ViewLoading from '../../elements/ViewLoading';
import { TrainingByDateDetails } from './../../../../types/models';
import BackgroundMainSection from '../../elements/BackgroundMainSection';
import { useHomeContext } from '../HomeContext';
import React from 'react';
import {
  usePostApiIdGetTrainingByDate,
  useGetApiIdGetTrainingDates,
} from '../../../../api/generated/training/training';
import { TrainingByDateDetailsDto, WeightUnits } from '../../../../api/generated/model';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import 'moment/locale/pl';
import HistoryMonthPickerButton from './HistoryMonthPickerButton';
import HistoryMonthPickerModal from './HistoryMonthPickerModal';

type TrainingExerciseDto = NonNullable<TrainingByDateDetailsDto['exercises']>[number];
type TrainingScoreDto = NonNullable<TrainingExerciseDto['scoresDetails']>[number];

const mapTrainingScore = (score: TrainingScoreDto) => ({
  ...(score._id ? { _id: score._id } : {}),
  weight: score.weight || 0,
  unit: score.unit?.displayName || WeightUnits.Kilograms,
  reps: score.reps || 0,
  exercise: score.exercise || '',
  series: score.series || 0,
});

const mapTrainingExercise = (exercise: TrainingExerciseDto) => ({
  exerciseScoreId: exercise.exerciseScoreId || '',
  scoresDetails: Array.isArray(exercise.scoresDetails)
    ? exercise.scoresDetails.map(mapTrainingScore)
    : [],
  exerciseDetails: {
    _id: exercise.exerciseDetails?._id || '',
    name: exercise.exerciseDetails?.name || '',
    bodyPart: exercise.exerciseDetails?.bodyPart?.displayName || '',
  },
});

const mapTrainingByDateDetails = (dto: TrainingByDateDetailsDto): TrainingByDateDetails => ({
  _id: dto._id || '',
  type: dto.type || '',
  createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  planDay: {
    name: dto.planDay?.name || '',
  },
  gym: dto.gym || '',
  exercises: Array.isArray(dto.exercises) ? dto.exercises.map(mapTrainingExercise) : [],
});

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonth = (date: Date, offset: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + offset, 1);

const History: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userId } = useHomeContext();
  const isFocused = useIsFocused();
  const calendar = useRef(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMonthPickerOpen, setMonthPickerOpen] = useState<boolean>(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(toMonthStart(new Date()));
  const [trainings, setTrainings] = useState<TrainingByDateDetails[]>();
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const { mutateAsync: getTrainingByDateMutation } = usePostApiIdGetTrainingByDate();
  const { data: trainingDatesData, refetch: refetchTrainingDates } = useGetApiIdGetTrainingDates(
    userId,
    {
      query: { enabled: !!userId },
    },
  );

  const trainingDates = useMemo(() => {
    const dates = trainingDatesData?.data;
    if (!Array.isArray(dates)) return [];

    return dates
      .filter((date): date is string => typeof date === 'string' && !Number.isNaN(Date.parse(date)))
      .map((date) => ({
        date: new Date(date),
        dots: [{ color: '#94e798' }],
      }));
  }, [trainingDatesData]);

  const trainingDateKeys = useMemo(() => {
    const dates = trainingDatesData?.data;
    if (!Array.isArray(dates)) return new Set<string>();

    const keys = dates
      .filter((date): date is string => typeof date === 'string' && !Number.isNaN(Date.parse(date)))
      .map((date) => toDateKey(new Date(date)));

    return new Set(keys);
  }, [trainingDatesData]);

  const calendarLocale = useMemo(() => {
    const localeName = i18n.language.startsWith('pl') ? 'pl' : 'en';
    return {
      name: localeName,
      config: {
        months: t('history.calendar.months', { returnObjects: true }) as string[],
        monthsShort: t('history.calendar.monthsShort', { returnObjects: true }) as string[],
        weekdays: t('history.calendar.weekdays', { returnObjects: true }) as string[],
        weekdaysShort: t('history.calendar.weekdaysShort', { returnObjects: true }) as string[],
        weekdaysMin: t('history.calendar.weekdaysMin', { returnObjects: true }) as string[],
      },
    };
  }, [i18n.language, t]);

  const resolveDateFromSelection = useCallback((dateValue: unknown): Date | null => {
    const toValidDate = (value: unknown): Date | null => {
      if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
      if (typeof value === 'string' || typeof value === 'number') {
        const parsedDate = new Date(value);
        if (!Number.isNaN(parsedDate.getTime())) return parsedDate;
      }
      return null;
    };

    const directDate = toValidDate(dateValue);
    if (directDate) return directDate;

    if (dateValue && typeof dateValue === 'object' && '_d' in dateValue) {
      return toValidDate((dateValue as { _d?: unknown })._d);
    }

    return null;
  }, []);

  const getTrainingByDate = useCallback(
    async (dateValue: unknown): Promise<void> => {
      if (!userId) return;

      const date = resolveDateFromSelection(dateValue);
      if (!date) {
        setTrainings([]);
        return;
      }

      setSelectedDate(date);
      setVisibleMonth(toMonthStart(date));

      setViewLoading(true);

      try {
        const result = await getTrainingByDateMutation({
          id: userId,
          data: { createdAt: date.toISOString() },
        });

        const rawTrainings = Array.isArray(result.data) ? result.data : [];
        const mappedTrainings: TrainingByDateDetails[] = rawTrainings.map(mapTrainingByDateDetails);

        setTrainings(mappedTrainings);
      } catch {
        setTrainings([]);
      } finally {
        setViewLoading(false);
      }
    },
    [getTrainingByDateMutation, resolveDateFromSelection, userId],
  );

  const monthGridDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<Date | null> = [];

    for (let index = 0; index < firstWeekday; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= totalDaysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [visibleMonth]);

  const monthTitle = useMemo(() => {
    const monthName = calendarLocale.config.months[visibleMonth.getMonth()] || '';
    return `${monthName} ${visibleMonth.getFullYear()}`;
  }, [calendarLocale.config.months, visibleMonth]);

  const weekdayLabels = useMemo(() => {
    const labels = calendarLocale.config.weekdaysMin;
    return Array.isArray(labels) ? labels : [];
  }, [calendarLocale.config.weekdaysMin]);

  const selectedDateKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);

  const openMonthPicker = useCallback(() => {
    setVisibleMonth(toMonthStart(selectedDate));
    setMonthPickerOpen(true);
  }, [selectedDate]);

  const handleDayPress = useCallback(
    (date: Date) => {
      setMonthPickerOpen(false);
      void getTrainingByDate(date);
    },
    [getTrainingByDate],
  );

  useEffect(() => {
    if (!isFocused || !userId) return;

    const refreshHistory = async () => {
      await refetchTrainingDates();
      await getTrainingByDate(new Date());
    };

    void refreshHistory();
  }, [getTrainingByDate, isFocused, refetchTrainingDates, userId]);

  return (
    <BackgroundMainSection>
      <View className="flex flex-col h-full p-4">
        <HistoryMonthPickerButton onPress={openMonthPicker} />
        <ReactNativeCalendarStrip
          onDateSelected={getTrainingByDate}
          ref={calendar}
          selectedDate={selectedDate}
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
          style={{ width: '100%', height: 150 }}
          dayContainerStyle={{
            backgroundColor: 'rgb(40, 40, 40)',
            borderRadius: 8,
            padding: 4,
          }}
          calendarHeaderStyle={{
            color: 'white',
            fontSize: 22,
            paddingBottom: 16,
          }}
          dateNumberStyle={{ color: '#5A5A5A', fontSize: 16 }}
          dateNameStyle={{ color: '#5A5A5A', fontSize: 14 }}
          highlightDateContainerStyle={{
            backgroundColor: '#20BC2D',
          }}
          highlightDateNumberContainerStyle={{
            backgroundColor: '#20BC2D',
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
            backgroundColor: '#20BC2D',
            borderRadius: 4,
          }}
          numDaysInWeek={5}
          locale={calendarLocale}
        />
        <HistoryMonthPickerModal
          visible={isMonthPickerOpen}
          visibleMonthTitle={monthTitle}
          weekdayLabels={weekdayLabels}
          monthGridDays={monthGridDays}
          selectedDateKey={selectedDateKey}
          trainingDateKeys={trainingDateKeys}
          closeLabel={t('history.closeCalendar')}
          onClose={() => setMonthPickerOpen(false)}
          onPrevMonth={() => setVisibleMonth((current) => addMonth(current, -1))}
          onNextMonth={() => setVisibleMonth((current) => addMonth(current, 1))}
          onDaySelect={handleDayPress}
          toDateKey={toDateKey}
        />
        {viewLoading ? (
          <ViewLoading />
        ) : trainings && trainings.length ? (
          <TrainingSession trainings={trainings} />
        ) : (
          <View className="flex justify-center w-full h-1/2 items-center p-4">
            <Text
              style={{ fontFamily: 'OpenSans_700Bold' }}
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
