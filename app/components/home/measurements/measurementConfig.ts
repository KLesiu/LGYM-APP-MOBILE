import {
  MeasurementFormDtoBodyPart,
  MeasurementFormDtoUnit,
} from "../../../../api/generated/model";

export type BodyPartFilter = MeasurementFormDtoBodyPart | "ALL";

export type MeasurementTypeOption = {
  value: BodyPartFilter;
  labelKey: string;
};

export type UnitOption = {
  value: MeasurementFormDtoUnit;
  labelKey: string;
};

export type MeasurementFieldConfig = {
  key: MeasurementFormDtoBodyPart;
  labelKey: string;
  defaultUnit: MeasurementFormDtoUnit;
  unitOptions: UnitOption[];
};

export const LENGTH_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Centimeters, labelKey: "measurements.units.Centimeters" },
  { value: MeasurementFormDtoUnit.Meters, labelKey: "measurements.units.Meters" },
  { value: MeasurementFormDtoUnit.Millimeters, labelKey: "measurements.units.Millimeters" },
];

export const WEIGHT_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Kilograms, labelKey: "measurements.units.Kilograms" },
  { value: MeasurementFormDtoUnit.Pounds, labelKey: "measurements.units.Pounds" },
];

export const PERCENT_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Percent, labelKey: "measurements.units.Percent" },
];

export const BMI_UNIT_OPTIONS: UnitOption[] = [
  { value: MeasurementFormDtoUnit.Bmi, labelKey: "measurements.units.Bmi" },
];

// TODO: BMI should return as an automatically calculated value, not a manual input option.

export const MEASUREMENT_FIELD_CONFIGS: MeasurementFieldConfig[] = [
  {
    key: MeasurementFormDtoBodyPart.BodyWeight,
    labelKey: "measurements.bodyParts.BodyWeight",
    defaultUnit: MeasurementFormDtoUnit.Kilograms,
    unitOptions: WEIGHT_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Neck,
    labelKey: "measurements.bodyParts.Neck",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Chest,
    labelKey: "measurements.bodyParts.Chest",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Waist,
    labelKey: "measurements.bodyParts.Waist",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Abs,
    labelKey: "measurements.bodyParts.Abs",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Hips,
    labelKey: "measurements.bodyParts.Hips",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Thigh,
    labelKey: "measurements.bodyParts.Thigh",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Calves,
    labelKey: "measurements.bodyParts.Calves",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Biceps,
    labelKey: "measurements.bodyParts.Biceps",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
  {
    key: MeasurementFormDtoBodyPart.Shoulders,
    labelKey: "measurements.bodyParts.Shoulders",
    defaultUnit: MeasurementFormDtoUnit.Centimeters,
    unitOptions: LENGTH_UNIT_OPTIONS,
  },
];

export const MEASUREMENT_TYPE_OPTIONS: MeasurementTypeOption[] = [
  { value: "ALL", labelKey: "measurements.filters.allBodyParts" },
  ...MEASUREMENT_FIELD_CONFIGS.map(({ key, labelKey }) => ({
    value: key,
    labelKey,
  })),
];

export const UNIT_OPTIONS_BY_TYPE: Record<
  Exclude<BodyPartFilter, "ALL">,
  UnitOption[]
> = {
  [MeasurementFormDtoBodyPart.Unknown]: [],
  [MeasurementFormDtoBodyPart.BodyWeight]: WEIGHT_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.BodyFat]: PERCENT_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Bmi]: BMI_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Neck]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Chest]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Waist]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Abs]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Hips]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Thigh]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Calves]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Biceps]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Shoulders]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Back]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Triceps]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Forearms]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Quads]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Hamstrings]: LENGTH_UNIT_OPTIONS,
  [MeasurementFormDtoBodyPart.Glutes]: LENGTH_UNIT_OPTIONS,
};
