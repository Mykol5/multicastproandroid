import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [roomId, setRoomId] = useState('');
  const [streamerName, setStreamerName] = useState('');
  const router = useRouter();

  const handleStartStream = () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a Room ID');
      return;
    }
    if (!streamerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    router.push({
      pathname: '/stream/[roomId]',
      params: { 
        roomId: roomId.trim(),
        streamerName: streamerName.trim()
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>🎥 MultiCast Pro</Text>
        <Text style={styles.subtitle}>Android Streamer</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Room ID"
          placeholderTextColor="#999"
          value={roomId}
          onChangeText={setRoomId}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#999"
          value={streamerName}
          onChangeText={setStreamerName}
        />
        
        <TouchableOpacity style={styles.startButton} onPress={handleStartStream}>
          <Text style={styles.startButtonText}>Start Streaming</Text>
        </TouchableOpacity>
        
        <Text style={styles.hint}>
          Share Room ID with viewers to watch your stream
        </Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 48,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
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
  hint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 24,
  },
});