import React from "react";
import { Image } from "react-native";
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
import { BodyParts } from "../../../enums/BodyParts";
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
  bodyPart: BodyParts;
  showBig?: boolean;
}

const BodyPartImage: React.FC<BodyPartImageProps> = ({ bodyPart, showBig=false }) => {
  const getImageSource = (part: BodyParts) => {
    switch (part) {
      case BodyParts.Chest:
        return showBig ? ChestBig : Chest;
      case BodyParts.Back:
        return showBig ? BackBig : Back;
      case BodyParts.Shoulders:
        return showBig ? ShouldersBig : Shoulders;
      case BodyParts.Abs:
        return showBig ? AbsBig : Abs;
      case BodyParts.Biceps:
        return showBig ? BicepsBig : Biceps;
      case BodyParts.Triceps:
        return showBig ? TricepsBig : Triceps;
      case BodyParts.Forearms:
        return showBig ? ForearmsBig : Forearms;
      case BodyParts.Quads:
        return showBig ? QuadsBig : Quads;
      case BodyParts.Hamstrings:
        return showBig ? HamstringsBig : Hamstrings;
      case BodyParts.Calves:
        return showBig ? CalvesBig : Calves;
      case BodyParts.Glutes:
        return showBig ? GlutesBig : Glutes;
      default:
        return null;
    }
  };
  return <Image className={`${showBig ? "scale-75" : ''}`} source={getImageSource(bodyPart)} style={{height: showBig ? 250 : 75 }} />;
};
export default BodyPartImage;
