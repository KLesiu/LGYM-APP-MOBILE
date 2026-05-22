import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePostApiTrainerInvitationsByEmail } from '../../../api/generated/trainer-relationship/trainer-relationship';
import toastService from '../../services/toastService';
import { getErrorMessage } from '../../../utils/errorHandler';

interface InviteTrainerByEmailProps {
  onInviteSent?: (email: string) => void;
}

const InviteTrainerByEmail: React.FC<InviteTrainerByEmailProps> = ({
  onInviteSent,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { mutateAsync: inviteTrainer, isPending } = usePostApiTrainerInvitationsByEmail();

  const trimmedEmail = useMemo(() => email.trim(), [email]);
  const isValidEmail = useMemo(() => {
    if (!trimmedEmail) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  }, [trimmedEmail]);

  const handleSubmit = async () => {
    if (!trimmedEmail) {
      toastService.showValidationError(t('auth.emailRequired'));
      return;
    }

    if (!isValidEmail) {
      toastService.showValidationError(t('auth.invalidEmail'));
      return;
    }

    try {
      await inviteTrainer({
        data: {
          email: trimmedEmail,
        },
      });
      toastService.showSuccess(t('trainer.invitationSent'));
      if (onInviteSent) {
        onInviteSent(trimmedEmail);
      }
      setEmail('');
    } catch (error) {
      const errorMessage = getErrorMessage(error, t('trainer.invitationFailed'));
      toastService.showError(errorMessage, t('trainer.invitationFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite Trainer by Email</Text>
      <Text style={styles.description}>
        Enter the email address of the trainer you want to invite
      </Text>

      <TextInput
        style={styles.input}
        placeholder="trainer@example.com"
        value={email}
        onChangeText={setEmail}
        editable={!isPending}
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isPending || !isValidEmail}
      >
        <Text style={styles.buttonText}>
          {isPending ? 'Sending...' : 'Send Invitation'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InviteTrainerByEmail;
