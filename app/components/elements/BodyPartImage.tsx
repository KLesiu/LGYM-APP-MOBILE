import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import Chest from "./../../../img/bodyParts/Chest.png";
import Back from "./../../../img/bodyParts/Back.png";
import Shoulders from "./../../../img/bodyParts/Shoulders.png";
import Abs from "./../../../img/bodyParts/Abs.png";
import Biceps from "./../../../img/bodyParts/Biceps.png";
import Triceps from "./../../../img/bodyParts/Triceps.png";
import Forearms from "./../../../img/bodyParts/Forearms.png";
import Quads from "./../../../img/bodyParts/Quads.png";
import Hamstrings from "./../../../img/bodyParts/Hamstrings.png";
import Calves from "./../../../img/bodyParts/Calves.png";
import Glutes from "./../../../img/bodyParts/Glutes.png";
import { ExerciseFormDtoBodyPart } from "../../../api/generated/model";
import type { ExerciseFormDtoBodyPart as ExerciseBodyPartValue } from "../../../api/generated/model";
import ChestBig from "./../../../img/bodyParts/bigSize/Chest.png"
import BackBig from "./../../../img/bodyParts/bigSize/Back.png"
import ShouldersBig from "./../../../img/bodyParts/bigSize/Shoulders.png"
import AbsBig from "./../../../img/bodyParts/bigSize/Abs.png"
import BicepsBig from "./../../../img/bodyParts/bigSize/Biceps.png"
import TricepsBig from "./../../../img/bodyParts/bigSize/Triceps.png"
import ForearmsBig from "./../../../img/bodyParts/bigSize/Forearms.png"
import QuadsBig from "./../../../img/bodyParts/bigSize/Quads.png"
import HamstringsBig from "./../../../img/bodyParts/bigSize/Hamstrings.png"
import CalvesBig from "./../../../img/bodyParts/bigSize/Calves.png"
import GlutesBig from "./../../../img/bodyParts/bigSize/Glutes.png"

interface BodyPartImageProps {
  bodyPart?: string | null;
  showBig?: boolean;
}

const resolveBodyPart = (value?: string | null): ExerciseBodyPartValue => {
  const allowed = Object.values(ExerciseFormDtoBodyPart);
  if (value && allowed.includes(value as ExerciseBodyPartValue)) {
    return value as ExerciseBodyPartValue;
  }

  return ExerciseFormDtoBodyPart.Unknown;
};

const BodyPartImage: React.FC<BodyPartImageProps> = ({ bodyPart, showBig = false }) => {
  const getImageSource = (part: ExerciseBodyPartValue): ImageSourcePropType | null => {
    switch (part) {
      case ExerciseFormDtoBodyPart.Chest:
        return showBig ? ChestBig : Chest;
      case ExerciseFormDtoBodyPart.Back:
        return showBig ? BackBig : Back;
      case ExerciseFormDtoBodyPart.Shoulders:
        return showBig ? ShouldersBig : Shoulders;
      case ExerciseFormDtoBodyPart.Abs:
        return showBig ? AbsBig : Abs;
      case ExerciseFormDtoBodyPart.Biceps:
        return showBig ? BicepsBig : Biceps;
      case ExerciseFormDtoBodyPart.Triceps:
        return showBig ? TricepsBig : Triceps;
      case ExerciseFormDtoBodyPart.Forearms:
        return showBig ? ForearmsBig : Forearms;
      case ExerciseFormDtoBodyPart.Quads:
        return showBig ? QuadsBig : Quads;
      case ExerciseFormDtoBodyPart.Hamstrings:
        return showBig ? HamstringsBig : Hamstrings;
      case ExerciseFormDtoBodyPart.Calves:
        return showBig ? CalvesBig : Calves;
      case ExerciseFormDtoBodyPart.Glutes:
        return showBig ? GlutesBig : Glutes;
      default:
        return null;
    }
  };

  const imageSource = getImageSource(resolveBodyPart(bodyPart));
  if (!imageSource) {
    return null;
  }

  return (
    <Image
      className={showBig ? "scale-75" : ""}
      source={imageSource}
      style={{ height: showBig ? 250 : 75 }}
    />
  );
};
export default BodyPartImage;
