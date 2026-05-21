import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import TrainerInvitationItem from './TrainerInvitationItem';

interface TrainerInvitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface TrainerInvitationsListProps {
  invitations?: TrainerInvitation[];
  isLoading?: boolean;
  onRevoke?: (invitationId: string) => void;
  onLoadMore?: () => void;
}

const TrainerInvitationsList: React.FC<TrainerInvitationsListProps> = ({
  invitations = [],
  isLoading = false,
  onRevoke,
  onLoadMore,
}) => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: TrainerInvitation }) => (
    <TrainerInvitationItem
      invitation={item}
      onRevoke={onRevoke}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No trainer invitations yet</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trainer Invitations</Text>
      <Text style={styles.description}>
        Manage your pending trainer invitations
      </Text>

      <FlatList
        data={invitations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        scrollEnabled={false}
        style={styles.list}
      />

      <Text style={styles.placeholder}>
        [Scaffold: Pagination and API integration will be added in Task 8]
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    marginBottom: 12,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default TrainerInvitationsList;
