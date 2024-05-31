import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline, Marker, Circle } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [crimeDensity, setCrimeDensity] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState([]);

  useEffect(() => {
    fetchCrimeData();
    getCurrentLocation();
  }, []);

  const fetchCrimeData = async () => {
    try {
      const response = await axios.get('https://data.lacity.org/resource/2nrs-mtv8.json');
      const data = response.data.map(crime => ({
        latitude: parseFloat(crime.lat),
        longitude: parseFloat(crime.lon),
        title: crime.crm_cd_desc,
        description: crime.location,
      }));
      setCrimeData(data);
      calculateCrimeDensity(data);
    } catch (error) {
      console.error('Error fetching crime data:', error);
    }
  };

  const calculateCrimeDensity = (data) => {
    const densityMap = {};
    data.forEach(crime => {
      const key = `${crime.latitude},${crime.longitude}`;
      if (!densityMap[key]) {
        densityMap[key] = { ...crime, count: 0 };
      }
      densityMap[key].count += 1;
    });
    setCrimeDensity(Object.values(densityMap));
  };

 
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
  };

  useEffect(() => {
    if (crimeData.length > 0 && currentLocation) {
      const optimizedRoute = calculateOptimizedRoute(crimeData, currentLocation);
      setOptimizedRoute(optimizedRoute);
    }
  }, [crimeData, currentLocation]);

  const calculateOptimizedRoute = (crimeData, currentLocation) => {
    // Calculate centroid of crime hotspots
    const centroid = calculateCentroid(crimeData);

    // Generate route: Current Location -> Centroid -> Current Location
    const optimizedRoute = [currentLocation, centroid, currentLocation];

    return optimizedRoute;
  };

  const calculateCentroid = (crimeData) => {
    // Calculate centroid logic
    // Example: Average latitude and longitude of crime hotspots
    let totalLat = 0;
    let totalLng = 0;

    for (const crime of crimeData) {
      totalLat += crime.latitude;
      totalLng += crime.longitude;
    }

    const centroidLat = totalLat / crimeData.length;
    const centroidLng = totalLng / crimeData.length;

    return { latitude: centroidLat, longitude: centroidLng };
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
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        {/* Render crime density circles */}
        {crimeDensity.map((crime, index) => (
          <Circle
            key={index}
            center={{ latitude: crime.latitude, longitude: crime.longitude }}
            radius={crime.count * 50} // Adjust radius for better visibility
            fillColor="rgba(255, 0, 0, 0.3)" // Semi-transparent red
            strokeColor="rgba(255, 0, 0, 0.3)"
          />
        ))}
        {/* Render current location marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Current Location"
            pinColor="blue"
          />
        )}
        {/* Render optimized route polyline */}
        {optimizedRoute.length > 0 && (
          <Polyline
            coordinates={optimizedRoute}
            strokeColor="#00FF00" // Green color for optimized route
            strokeWidth={3}
          />
        )}
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