import { Image, ImageProps } from "react-native";
import { useEffect, useState } from "react";
import Ranks from "./../../../helpers/rankStore";
import React from "react";
interface ProfileRankProps {
  rank: string;
  customClasses?: string;
}

const ProfileRank: React.FC<ProfileRankProps> = (props) => {
  const [rankSrc, setSrcRank] = useState<ImageProps>();
  const getRank = async () => {
    if (props.rank === "Junior 1") setSrcRank(Ranks.Junior1);
    else if (props.rank === "Junior 2") setSrcRank(Ranks.Junior2);
    else if (props.rank === "Junior 3") setSrcRank(Ranks.Junior3);
    else if (props.rank === "Mid 1") setSrcRank(Ranks.Mid1);
    else if (props.rank === "Mid 2") setSrcRank(Ranks.Mid2);
    else if (props.rank === "Mid 3") setSrcRank(Ranks.Mid3);
    else if (props.rank === "Pro 1") setSrcRank(Ranks.Pro1);
    else if (props.rank === "Pro 2") setSrcRank(Ranks.Pro2);
    else if (props.rank === "Pro 3") setSrcRank(Ranks.Pro3);
    else if (props.rank === "Champ") setSrcRank(Ranks.Champ);
  };
  useEffect(() => {
    getRank();
  }, [props.rank]);
  if (!rankSrc) return null;
  return (
    <Image
      className={` midPhone:h-24 midPhone:w-24 h-32 w-32 smallPhone:h-20 smallPhone:w-20 ${props.customClasses}`}
      source={rankSrc as ImageProps}
    />
  );
};
export default ProfileRank;
