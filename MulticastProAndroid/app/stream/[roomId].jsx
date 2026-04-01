import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Camera } from 'expo-camera';
import { useWebRTC } from '../../hooks/useWebRTC';

export default function StreamScreen() {
  const { roomId, streamerName } = useLocalSearchParams();
  const router = useRouter();
  const cameraRef = useRef(null);
  
  const { isStreaming, localStream, roomInfo, startStream, stopStream } = useWebRTC();

  useEffect(() => {
    // Start stream when component mounts
    startStream(roomId, streamerName);
    
    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleStopAndGoBack();
      return true;
    });
    
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleStopAndGoBack = () => {
    stopStream();
    router.back();
  };

  const confirmStopStream = () => {
    Alert.alert(
      'Stop Streaming',
      'Are you sure you want to stop your stream?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', onPress: handleStopAndGoBack, style: 'destructive' },
      ]
    );
  };

  if (!isStreaming) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Starting stream...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.streamContainer}>
        <Camera
          ref={cameraRef}
          style={styles.video}
          type={Camera.Constants.Type.front}
          ratio="16:9"
        />
        
        <View style={styles.controls}>
          <View style={styles.statusContainer}>
            <Text style={styles.roomText}>Room: {roomInfo.roomId || roomId}</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>🔴 LIVE</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.stopButton} onPress={confirmStopStream}>
            <Text style={styles.stopButtonText}>Stop Streaming</Text>
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            Share Room ID "{roomInfo.roomId || roomId}" with viewers
          </Text>
          <Text style={styles.infoTextSmall}>
            Viewers can watch from any browser
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  streamContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roomText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  liveBadge: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  infoTextSmall: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },
});