import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function SecondScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50.846705, // Amsterdam
          longitude: 4.352419,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Voeg een marker toe */}
        <Marker
          coordinate={{
            latitude: 50.846705,
            longitude: 4.352419,
          }}
          title="Brussel"
          description="Hoofdstad van België"
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
