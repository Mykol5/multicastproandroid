import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [roomId, setRoomId] = useState('');
  const [streamerName, setStreamerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartStream = async () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a Room ID');
      return;
    }
    if (!streamerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setIsLoading(true);
    
    router.push({
      pathname: '/stream/[roomId]',
      params: { 
        roomId: roomId.trim(),
        streamerName: streamerName.trim()
      }
    });
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.header}>
          <Text style={styles.title}>🎥 MultiCast Pro</Text>
          <Text style={styles.subtitle}>Android Streamer</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Room ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter unique room ID"
            placeholderTextColor="#999"
            value={roomId}
            onChangeText={setRoomId}
            editable={!isLoading}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={streamerName}
            onChangeText={setStreamerName}
            editable={!isLoading}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.startButton, isLoading && styles.disabledButton]} 
          onPress={handleStartStream}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.startButtonText}>Start Streaming</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});