import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

export default function Popup({ visible, onClose, message }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Zorg ervoor dat de popup kan worden gesloten
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.emoji}>🙏</Text>
          <Text style={styles.message}>{message || "Thank you for your contribution!"}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 250,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
