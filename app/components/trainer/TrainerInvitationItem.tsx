import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface TrainerInvitation {
  id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface TrainerInvitationItemProps {
  invitation: TrainerInvitation;
  onRevoke?: (invitationId: string) => void;
  isRevoking?: boolean;
}

const TrainerInvitationItem: React.FC<TrainerInvitationItemProps> = ({
  invitation,
  onRevoke,
  isRevoking = false,
}) => {
  const { t } = useTranslation();

  const handleRevoke = () => {
    if (onRevoke) {
      onRevoke(invitation.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.email}>{invitation.email}</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(invitation.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(invitation.status)}
            </Text>
          </View>
          <Text style={styles.date}>
            {new Date(invitation.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {invitation.status === 'pending' && (
        <TouchableOpacity
          style={[styles.revokeButton, isRevoking && styles.revokeButtonDisabled]}
          onPress={handleRevoke}
          disabled={isRevoking}
        >
          <Text style={styles.revokeButtonText}>
            {isRevoking ? 'Revoking...' : 'Revoke'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  content: {
    flex: 1,
  },
  email: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  revokeButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  revokeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  revokeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TrainerInvitationItem;
