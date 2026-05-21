import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

interface InviteTrainerByEmailProps {
  onInviteSent?: (email: string) => void;
  isLoading?: boolean;
}

const InviteTrainerByEmail: React.FC<InviteTrainerByEmailProps> = ({
  onInviteSent,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // TODO: Implement API call to inviteTrainerByEmail mutation
    // usePostApiTrainerInvitationsByEmail hook will be used here
    if (onInviteSent) {
      onInviteSent(email);
    }
    setEmail('');
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
        editable={!isLoading}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading || !email}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Sending...' : 'Send Invitation'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.placeholder}>
        [Scaffold: Form validation and API integration will be added in Task 8]
      </Text>
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
  placeholder: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default InviteTrainerByEmail;
