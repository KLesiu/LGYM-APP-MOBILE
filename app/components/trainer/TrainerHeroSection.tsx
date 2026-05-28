import React from "react";
import { View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";

interface TrainerHeroSectionProps {
  trainerId: string;
  trainerName: string;
  trainerEmail: string;
  trainerSpecialization?: string | null;
  trainerAvatar?: string | null;
}

const TrainerHeroSection: React.FC<TrainerHeroSectionProps> = ({
  trainerId,
  trainerName,
  trainerEmail,
  trainerSpecialization,
  trainerAvatar,
}) => {
  const { t } = useTranslation();

  return (
    <View className="bg-secondaryColor p-4 rounded-lg">
      <Text 
        className="text-primaryColor text-base mb-3"
        style={{ fontFamily: "OpenSans_700Bold" }}
      >
        {t("trainer.yourTrainer", "Your Trainer")}
      </Text>
      
      <View className="flex-row items-center" style={{ gap: 12 }}>
        {trainerAvatar ? (
          <Image 
            source={{ uri: trainerAvatar }} 
            className="w-16 h-16 rounded-full bg-primaryColor/20"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-primaryColor/20 items-center justify-center">
            <Text 
              className="text-primaryColor text-2xl"
              style={{ fontFamily: "OpenSans_700Bold" }}
            >
              {trainerName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View className="flex-1">
          <Text 
            className="text-textColor text-lg"
            style={{ fontFamily: "OpenSans_700Bold" }}
          >
            {trainerName}
          </Text>
          {trainerSpecialization && (
            <Text 
              className="text-textColor text-sm opacity-60"
              style={{ fontFamily: "OpenSans_400Regular" }}
            >
              {trainerSpecialization}
            </Text>
          )}
          <Text 
            className="text-textColor text-xs opacity-50"
            style={{ fontFamily: "OpenSans_400Regular" }}
          >
            {trainerEmail}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TrainerHeroSection;
