import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const MapScreen = () => {
  const [crimeData, setCrimeData] = useState([]);

  useEffect(() => {
    fetchCrimeData();
  }, []);

  const fetchCrimeData = async () => {
    try {
      const response = await axios.get('https://data.lacity.org/resource/2nrs-mtv8.json');
      setCrimeData(response.data);
    } catch (error) {
      console.error('Error fetching crime data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 34.0522,
          longitude: -118.2437,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {crimeData.map((crime) => (
          <Marker
            key={crime.id}
            coordinate={{ latitude: crime.lat, longitude: crime.lon}}
            loacation={crime.location}
            description={crime.crm_cd_desc}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
