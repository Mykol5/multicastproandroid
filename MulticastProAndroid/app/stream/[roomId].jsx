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
import { RTCView } from 'react-native-webrtc';
import { useWebRTC } from '../../hooks/useWebRTC';

export default function StreamScreen() {  // Make sure this is the default export
  const { roomId, streamerName } = useLocalSearchParams();
  const router = useRouter();
  const { isStreaming, localStream, startStream, stopStream } = useWebRTC();

  useEffect(() => {
    startStream(roomId, streamerName);
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmStop();
      return true;
    });
    
    return () => {
      backHandler.remove();
      stopStream();
    };
  }, []);

  const confirmStop = () => {
    Alert.alert(
      'Stop Streaming',
      'Are you sure you want to stop?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', onPress: () => {
          stopStream();
          router.back();
        }, style: 'destructive' }
      ]
    );
  };

  if (!isStreaming) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Starting stream...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.streamContainer}>
        {localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.video}
            objectFit="cover"
            mirror={true}
          />
        )}
        
        <View style={styles.controls}>
          <View style={styles.statusContainer}>
            <Text style={styles.roomText}>Room: {roomId}</Text>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>🔴 LIVE</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.stopButton} onPress={confirmStop}>
            <Text style={styles.stopButtonText}>Stop Streaming</Text>
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            Share Room ID "{roomId}" with viewers
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  streamContainer: {
    flex: 1,
    width: '100%',
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
  },
});