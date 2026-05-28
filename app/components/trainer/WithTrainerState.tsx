import React from "react";
import { ScrollView } from "react-native";
import BackgroundMainSection from "../elements/BackgroundMainSection";
import TrainerHeroSection from "./TrainerHeroSection";
import CollaborationSection from "./CollaborationSection";

/**
 * WithTrainerState component displays the trainer screen when the user has an active trainer relationship.
 * 
 * TODO: Once backend API endpoint is available (GET /api/trainee/trainer or similar),
 * this component should fetch real trainer relationship data using generated hooks.
 * 
 * For now, it uses placeholder data to demonstrate the UI structure.
 */
const WithTrainerState: React.FC = () => {
  // TODO: Replace with actual API hook when available
  // const { data: trainerRelationship, isLoading, error } = useGetApiTraineeTrainer();
  
  // Placeholder data for development
  const mockTrainerData = {
    trainerId: "trainer-123",
    trainerName: "John Doe",
    trainerEmail: "john.doe@example.com",
    trainerSpecialization: "Strength & Conditioning",
    trainerAvatar: null,
    relationshipStartDate: "2024-01-15T10:00:00Z",
    relationshipStatus: "active",
  };

  return (
    <BackgroundMainSection>
      <ScrollView className="flex-1 p-4" style={{ gap: 16 }}>
        <TrainerHeroSection 
          trainerId={mockTrainerData.trainerId}
          trainerName={mockTrainerData.trainerName}
          trainerEmail={mockTrainerData.trainerEmail}
          trainerSpecialization={mockTrainerData.trainerSpecialization}
          trainerAvatar={mockTrainerData.trainerAvatar}
        />
        <CollaborationSection 
          relationshipStartDate={mockTrainerData.relationshipStartDate}
          relationshipStatus={mockTrainerData.relationshipStatus}
        />
        {/* TODO: Add sections from T11 (notifications from trainer) and T12 (trainer-managed plans) here */}
      </ScrollView>
    </BackgroundMainSection>
  );
};

export default WithTrainerState;
