import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import TrainerInvitationItem from './TrainerInvitationItem';
import { usePostApiTrainerInvitationsPaginated } from '../../../api/generated/trainer-relationship/trainer-relationship';
import toastService from '../../services/toastService';
import { getErrorMessage } from '../../../utils/errorHandler';
import type { TrainerInvitationDto } from '../../../api/generated/model';

const PAGE_SIZE = 10;

interface TrainerInvitationsListProps {
  refreshToken?: number;
  onRefreshHandled?: () => void;
}

const TrainerInvitationsList: React.FC<TrainerInvitationsListProps> = ({
  refreshToken,
  onRefreshHandled,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: fetchInvitations, isPending } = usePostApiTrainerInvitationsPaginated();
  const [invitations, setInvitations] = useState<TrainerInvitationDto[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitialLoading = isPending && invitations.length === 0;

  const loadInvitations = async (targetPage: number, append: boolean) => {
    try {
      const response = await fetchInvitations({
        data: {
          page: targetPage,
          pageSize: PAGE_SIZE,
        },
      });
      const payload = response?.data;
      const items = payload?.items ?? [];

      setInvitations((prev) => (append ? [...prev, ...items] : items));
      setPage(payload?.page ?? targetPage);
      setHasNextPage(Boolean(payload?.hasNextPage));
      setErrorMessage(null);
    } catch (error) {
      const message = getErrorMessage(error, t('trainer.invitationsLoadFailed'));
      setErrorMessage(message);
      toastService.showError(message, t('trainer.invitationsLoadFailed'));
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void loadInvitations(1, false);
  }, []);

  useEffect(() => {
    if (!refreshToken) return;
    void loadInvitations(1, false);
    if (onRefreshHandled) {
      onRefreshHandled();
    }
  }, [refreshToken]);

  const renderItem = ({ item }: { item: TrainerInvitationDto }) => (
    <TrainerInvitationItem
      invitation={item}
      onRevoke={handleRevokeCompleted}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('trainer.noInvitations')}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (isInitialLoading || isLoadingMore || !hasNextPage) return;
    setIsLoadingMore(true);
    void loadInvitations(page + 1, true);
  };

  const handleRevokeCompleted = () => {
    void loadInvitations(1, false);
  };

  const listData = useMemo(() => invitations, [invitations]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trainer Invitations</Text>
      <Text style={styles.description}>
        Manage your pending trainer invitations
      </Text>
      {errorMessage && invitations.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadInvitations(1, false)}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id ?? item.inviteeEmail ?? `${index}`}
          ListEmptyComponent={isInitialLoading ? null : renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          scrollEnabled={false}
          style={styles.list}
        />
      )}
      {isInitialLoading && (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
      {hasNextPage && !isInitialLoading && (
        <TouchableOpacity
          style={[styles.loadMoreButton, isLoadingMore && styles.loadMoreButtonDisabled]}
          onPress={handleLoadMore}
          disabled={isLoadingMore}
        >
          <Text style={styles.loadMoreText}>
            {isLoadingMore ? t('common.loading') : t('common.loadMore')}
          </Text>
        </TouchableOpacity>
      )}
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
  errorContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  loadMoreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  loadMoreButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TrainerInvitationsList;
