import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePostApiTrainerInvitationsInvitationIdRevoke } from '../../../api/generated/trainer-relationship/trainer-relationship';
import toastService from '../../services/toastService';
import { getErrorMessage } from '../../../utils/errorHandler';
import ConfirmDialog from '../elements/ConfirmDialog';
import type { TrainerInvitationDto } from '../../../api/generated/model';

interface TrainerInvitationItemProps {
  invitation: TrainerInvitationDto;
  onRevoke?: (invitationId: string) => void;
}

const TrainerInvitationItem: React.FC<TrainerInvitationItemProps> = ({
  invitation,
  onRevoke,
}) => {
  const { t } = useTranslation();
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const { mutateAsync: revokeInvitation, isPending } = usePostApiTrainerInvitationsInvitationIdRevoke();

  const invitationId = invitation._id ?? '';
  const status = invitation.status ?? 'pending';
  const email = invitation.inviteeEmail ?? invitation.traineeEmail ?? '';
  const createdAt = invitation.createdAt ?? '';

  const handleRevoke = async () => {
    if (!invitationId) return;
    try {
      await revokeInvitation({ invitationId });
      toastService.showSuccess(t('trainer.invitationRevoked'));
      if (onRevoke) {
        onRevoke(invitationId);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, t('trainer.invitationRevokeFailed'));
      toastService.showError(errorMessage, t('trainer.invitationRevokeFailed'));
    } finally {
      setIsConfirmVisible(false);
    }
  };

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
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

  const getStatusLabel = (statusValue: string) => {
    switch (statusValue) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return statusValue;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.email}>{email || '-'}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusLabel(status)}
              </Text>
            </View>
            <Text style={styles.date}>
              {createdAt ? new Date(createdAt).toLocaleDateString() : '-'}
            </Text>
          </View>
        </View>

        {status === 'pending' && (
          <TouchableOpacity
            style={[styles.revokeButton, isPending && styles.revokeButtonDisabled]}
            onPress={() => setIsConfirmVisible(true)}
            disabled={isPending || !invitationId}
          >
            <Text style={styles.revokeButtonText}>
              {isPending ? 'Revoking...' : 'Revoke'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <ConfirmDialog
        visible={isConfirmVisible}
        title={t('trainer.revokeInvitationTitle')}
        message={t('trainer.revokeInvitationMessage')}
        onConfirm={handleRevoke}
        onCancel={() => setIsConfirmVisible(false)}
      />
    </>
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
