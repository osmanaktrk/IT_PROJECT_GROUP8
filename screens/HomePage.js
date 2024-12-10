import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function SecondScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 52.3676, // Amsterdam
          longitude: 4.9041,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Voeg een marker toe */}
        <Marker
          coordinate={{
            latitude: 52.3676,
            longitude: 4.9041,
          }}
          title="Amsterdam"
          description="Hoofdstad van Nederland"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
