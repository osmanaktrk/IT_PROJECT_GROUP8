import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  Dimensions,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
} from "react-native";
import * as Speech from "expo-speech";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapView, { Marker, Circle, Polygon, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseAuth, firestoreDB } from "../../FirebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { useLoader } from "../LoaderContextPage";
import polyline from "@mapbox/polyline";
import debounce from "lodash.debounce";
import * as ParkAndRideSqliteService from "../SqliteService/park_and_ride_sqliteService";
import * as PublicParkingSqliteService from "../SqliteService/public_parking_sqliteService";
// import * as ParkingSpacesProprietySqliteService from "../SqliteService/on_street_acar_sqliteService";
import * as ParkingSpacesSqliteService from "../SqliteService/on_street_supply_pt_sqliteService";
// import * as FireBaseUploader from "../Database/firebaseUploader";
import * as OpenRouteServise from "../ApiService/openRouteService";

export default function App({ navigation }) {
  const [isSynchronizationActive, setIsSynchronizationActive] = useState(false);
  const [userCurrentLocation, setUserCurrentLocation] = useState(null);
  const [userLocationHeading, setUserLocationHeading] = useState(0);
  const [spotsDatabase, setSpotsDatabase] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const [park_and_ride, setPark_and_ride] = useState([]);
  const [public_parking, setPublic_parking] = useState([]);
  const [on_street_parking, setOn_street_parking] = useState([]);

  const [
    isParkingSpacesDatabaseInitialized,
    setIsParkingSpacesDatabaseInitialized,
  ] = useState(false);
  const [
    isParkAndRideDatabaseInitialized,
    setIsParkAndRideDatabaseInitialized,
  ] = useState(false);
  const [
    isPublicParkingDatabaseInitialized,
    setIsPublicParkingDatabaseInitialized,
  ] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeSteps, setRouteSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [routeInfo, setRouteInfo] = useState({});
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [navigationStepsInstnstruction, setNavigationStepsInstruction] =
    useState("");
  const [navigationIntervalId, setNavigationIntervalId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedSuggestions, setSearchedSuggestions] = useState([]);
  const [searchedLocations, setSearchedLocations] = useState([]);
  const [isSearchedSuggestions, setIsSearchedSuggestions] = useState(true);
  const [isSearched, setIsSearched] = useState(false);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [region, setRegion] = useState({
    latitude: 50.8503,
    longitude: 4.3517,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  // useEffect(() => {
  //   const updateDatabase = async () => {
  //     await ParkingSpacesSqliteService.updateSQLiteWithAvailableRecords();
  //     await ParkingSpacesSqliteService.updateSQLiteWithUnavailableRecords();
  //   };

  //   updateDatabase();
  // }, []);

  // useEffect(() => {

  //   const syncFirestoreToSQLite = async () => {
  //     await ParkingSpacesSqliteService.syncFirestoreToSQLite();
  //   };

  //   if(!isSynchronizationActive){

  //     syncFirestoreToSQLite();
  //     setIsSynchronizationActive(true);
  //     console.log("guncelleme çalisti");
  //   }
  // }, []);

  const mapRef = useRef(null);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width * 0.6)
  ).current;

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const translateX = useRef(new Animated.Value(screenWidth)).current;

  const [activeModule, setActiveModule] = useState(null);
  const [isNavigationSoundOn, setIsNavigationSoundOn] = useState(true);
  const [isAligningHeading, setIsAligningHeading] = useState(false);
  const [userLocationWatcher, setUserLocationWatcher] = useState(null);
  const [userLocationHeaderWatcher, setUserLocationHeaderWatcher] =
    useState(null);
  const [userHeading, setUserHeading] = useState(0);

  //modullerin isimlerine gore yukseklik belilr
  const moduleHeights = {
    navigationModal: screenHeight,
    module2: screenHeight * 0.5,
    module3: screenHeight * 0.4,
  };

  const openModule = (moduleName) => {
    setActiveModule(moduleName);

    Animated.timing(translateY, {
      toValue: screenHeight - moduleHeights[moduleName],
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModule = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setActiveModule(null));
  };

  const rightCornerTranslateY = translateY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [-screenHeight * 0.2, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newTranslateY = gestureState.dy > 0 ? gestureState.dy : 0;
        translateY.setValue(newTranslateY);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          openModule("navigationModal");
        } else {
          closeModule();
        }
      },
    })
  ).current;

  //clear all databases
  const deleteDatabases = async () => {
    try {
      await ParkAndRideSqliteService.deleteDatabase();
      await PublicParkingSqliteService.deleteDatabase();
      await ParkingSpacesSqliteService.deleteDatabase();
      console.log("Databases deleted successfully.");
    } catch (error) {
      Alert.alert("Error", `Database deleting failed: ${error.message}`);
    }
  };

  const handleMapRefresher = () => {
    setIsParkAndRideDatabaseInitialized(false);
    setIsParkingSpacesDatabaseInitialized(false);
    setIsPublicParkingDatabaseInitialized(false);
    setRouteCoordinates([]);
    setRouteInfo({});
    closeModule();
    setNavigationIntervalId(null);
  };

  const initializePublicParkingDatabase = async () => {
    try {
      showLoader();
      // await PublicParkingSqliteService.deleteDatabase();
      const result = await PublicParkingSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsPublicParkingDatabaseInitialized(result);

      if (result) {
        console.log("PublicParking database initialized successfully.");
      } else {
        console.log("PublicParking database not initialized.");
      }
    } catch (error) {
      setIsPublicParkingDatabaseInitialized(false);
      console.error("PublicParking database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  const initializeParkAndRideDatabase = async () => {
    try {
      showLoader();
      // await ParkAndRideSqliteService.deleteDatabase();
      const result = await ParkAndRideSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsParkAndRideDatabaseInitialized(result);

      if (result) {
        console.log("ParkAndRide database initialized successfully.");
      } else {
        console.log("ParkAndRide database not initialized.");
      }
    } catch (error) {
      setIsParkAndRideDatabaseInitialized(false);
      console.error("ParkAndRide database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  const initializeParkingSpacesDatabase = async () => {
    try {
      showLoader();
      // await ParkingSpacesSqliteService.deleteDatabase();
      const result = await ParkingSpacesSqliteService.initializeDatabase(
        showLoader,
        hideLoader
      );
      setIsParkingSpacesDatabaseInitialized(result);
      if (result) {
        console.log("ParkingSpaces database initialized successfully.");
      } else {
        console.log("ParkingSpaces database not initialized.");
      }
    } catch (error) {
      setIsParkingSpacesDatabaseInitialized(false);
      console.error("ParkingSpaces database initialization failed:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (!isPublicParkingDatabaseInitialized) {
      initializePublicParkingDatabase();
    }
  }, [isPublicParkingDatabaseInitialized]);

  useEffect(() => {
    if (!isParkAndRideDatabaseInitialized) {
      initializeParkAndRideDatabase();
    }
  }, [isParkAndRideDatabaseInitialized]);

  useEffect(() => {
    if (!isParkingSpacesDatabaseInitialized) {
      initializeParkingSpacesDatabase();
    }
  }, [isParkingSpacesDatabaseInitialized]);

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const positionSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (location) => {
          const latitude = location.coords.latitude;
          const longitude = location.coords.longitude;

          // Kullanıcı konumunu güncelle
          setUserCurrentLocation({
            latitude,
            longitude,
          });

          // Haritayı güncel konuma taşı
          if (mapRef.current) {
            mapRef.current.animateToRegion({ latitude, longitude }, 1000);
          }
        }
      );

      setUserLocationWatcher(positionSubscription);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch location: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserLocation();

    return () => {
      if (userLocationWatcher) {
        userLocationWatcher.remove();
      }
    };
  }, []);

  const startAligningMapToUserHeading = async () => {
    try {
      if (userLocationHeaderWatcher?.remove) {
        userLocationHeaderWatcher.remove();
      }

      const headingSubscription = await Location.watchHeadingAsync(
        (headingData) => {
          const trueHeading = headingData.trueHeading || 0;
          setUserHeading(trueHeading);

          if (mapRef.current && userCurrentLocation) {
            mapRef.current.animateCamera(
              {
                center: {
                  latitude: userCurrentLocation.latitude,
                  longitude: userCurrentLocation.longitude,
                },
                heading: trueHeading,
                zoom: 17,
              },
              { duration: 500 }
            );
          }

          // console.log(`Heading updated: ${trueHeading}`);
        }
      );

      setUserLocationHeaderWatcher(headingSubscription);
    } catch (error) {
      console.error("Error aligning map to heading:", error.message);
    }
  };

  const stopAligningMapToUserHeading = () => {
    if (userLocationHeaderWatcher) {
      userLocationHeaderWatcher.remove();

      setUserLocationHeaderWatcher(null);

      console.log("Stopped aligning map to heading.");
    }
  };

  useEffect(() => {
    if (isAligningHeading) {
      startAligningMapToUserHeading();
    } else {
      stopAligningMapToUserHeading();
    }
  }, [isAligningHeading]);

  const goToUserLocation = () => {
    if (userCurrentLocation) {
      mapRef.current?.animateToRegion({
        ...userCurrentLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } else {
      console.log("User location not available");
    }
  };

  const handleSearch = async () => {
    if (!searchText) {
      return;
    }

    try {
      setSearchedLocations([]);
      setSearchedSuggestions([]);

      const data = await OpenRouteServise.geocodeAutocompleteService(
        searchText
      );

      const suggestions = data.features.map((feature) => ({
        id: feature.properties.id || Math.random().toString(),
        name: feature.properties.label || "No label available",
        coordinates: feature.geometry.coordinates,
        country: feature.properties.country || "Unknown",
        region: feature.properties.region || "Unknown",
      }));

      if (suggestions.length === 1) {
        const [longitude, latitude] = suggestions[0].coordinates;
        const newRegion = {
          longitude,
          latitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        };
        setSearchedLocations(suggestions);
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
        setSearchText("");
      }

      if (suggestions.length > 1) {
        setSearchedSuggestions(suggestions);
        const coordinates = suggestions.map((item) => item.coordinates);
        const minLongitude = Math.min(...coordinates.map(([lng, lat]) => lng));
        const maxLongitude = Math.max(...coordinates.map(([lng, lat]) => lng));
        const minLatitude = Math.min(...coordinates.map(([lng, lat]) => lat));
        const maxLatitude = Math.max(...coordinates.map(([lng, lat]) => lat));

        const latitudeDelta = maxLatitude - minLatitude;
        const longitudeDelta = maxLongitude - minLongitude;

        const newRegion = {
          latitude: (maxLatitude + minLatitude) / 2,
          longitude: (maxLongitude + minLongitude) / 2,
          latitudeDelta: latitudeDelta * 1.2,
          longitudeDelta: longitudeDelta * 1.2,
        };

        setSearchedLocations(suggestions);
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
        setIsSearchedSuggestions(true);
      }
      if (suggestions.length === 0) {
        setIsSearchedSuggestions(false);
      }
      setIsSearched(true);
      console.log(suggestions);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (searchedSuggestions.length < 1) {
      return;
    }

    const [longitude, latitude] = Array.isArray(suggestion.coordinates)
      ? suggestion.coordinates
      : [suggestion.coordinates[0], suggestion.coordinates[1]];

    const newRegion = {
      longitude,
      latitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };

    setSearchText(suggestion.name);
    setSearchedLocations([suggestion]);
    setSearchedSuggestions([]);
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 1000);
    setSearchText("");
  };

  const handleDirection = async (destinationLongitude, destinationLatitude) => {
    if (
      !userCurrentLocation ||
      !userCurrentLocation.longitude ||
      !userCurrentLocation.latitude
    ) {
      console.error("User location is incomplete or not available.");
      return;
    }
    setRouteCoordinates([]);
    setRouteInfo({});

    try {
      showLoader();
      const data = await OpenRouteServise.directionsServiseJson(
        userCurrentLocation.longitude,
        userCurrentLocation.latitude,
        destinationLongitude,
        destinationLatitude
      );

      if (
        data &&
        data.routes &&
        data.routes.length > 0 &&
        data.routes[0].segments &&
        data.routes[0].geometry
      ) {
        const route = data.routes[0];
        const summary = route.summary;
        const bbox = route.bbox;
        const geometry = route.geometry;
        const distance = summary.distance.toFixed(2);
        const duration = (summary.duration / 60).toFixed(1);

        setRouteInfo({ distance: distance, duration: duration });

        const decodedCoordinates = polyline
          .decode(geometry)
          .map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }));

        setRouteCoordinates(decodedCoordinates);

        setRouteSteps(route.segments[0].steps);
        setCurrentStep(0);
        openModule("navigationModal");

        if (bbox.length === 4) {
          const [minLng, minLat, maxLng, maxLat] = bbox;
          const newRegion = {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.abs(maxLat - minLat) * 2,
            longitudeDelta: Math.abs(maxLng - minLng) * 2,
          };

          setRegion(newRegion);
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        console.log(routeInfo);
        console.log(data);
      } else {
        console.error("No valid routes or geometry found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error.message);
    } finally {
      hideLoader();
    }
  };

  const startNavigation = async () => {
    console.log("Navigation started!");

    if (userCurrentLocation && routeSteps.length > 0) {
      const firstStep = routeSteps[0];
      if (isNavigationSoundOn) {
        Speech.speak(firstStep.instruction);
      }
      setNavigationStepsInstruction(firstStep.instruction);

      mapRef.current?.animateToRegion({
        latitude: userCurrentLocation.latitude,
        longitude: userCurrentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      let currentStepIndex = 0;

      try {
        const navigationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (location) => {
            const userLat = location.coords.latitude;
            const userLng = location.coords.longitude;

            let nearestStepIndex = -1;
            let minDistance = Infinity;

            routeSteps.forEach((step, index) => {
              const stepLat = step.latitude;
              const stepLng = step.longitude;

              const distance = Math.sqrt(
                Math.pow(stepLat - userLat, 2) + Math.pow(stepLng - userLng, 2)
              );

              if (distance < minDistance) {
                minDistance = distance;
                nearestStepIndex = index;
              }
            });

            if (
              nearestStepIndex !== -1 &&
              nearestStepIndex !== currentStepIndex
            ) {
              currentStepIndex = nearestStepIndex;
              const nextStep = routeSteps[currentStepIndex];
              console.log(`Next step: ${nextStep.instruction}`);
              setNavigationStepsInstruction(nextStep.instruction);

              if (isNavigationSoundOn) {
                Speech.speak(nextStep.instruction);
              }

              mapRef.current?.animateCamera(
                {
                  center: {
                    latitude: nextStep.latitude,
                    longitude: nextStep.longitude,
                  },
                  heading: userLocationHeading || 0,
                  // pitch: 60,
                  zoom: 17,
                },
                { duration: 500 }
              );
            }
          }
        );

        setIsAligningHeading(true);
        setNavigationIntervalId(navigationSubscription);
      } catch (error) {
        console.error("Error starting navigation:", error.message);
      }
    } else {
      console.log("User location or route steps not available");
    }
  };

  const resetNavigation = () => {
    clearInterval(navigationIntervalId);
    setNavigationIntervalId(null);
    setNavigationStepsInstruction("");
    setRouteCoordinates([]);
    setRouteInfo({});
    closeModule();
    setIsAligningHeading(false);
    if (userCurrentLocation) {
      mapRef.current?.animateToRegion({
        ...userCurrentLocation,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } else {
      console.log("User location not available");
    }
    console.log("Route reset!");
  };

  // const fetchSpots = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(firestoreDB, "spots"));
  //     const spots = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       latitude: doc.data().coords.latitude,
  //       longitude: doc.data().coords.longitude,
  //       title: doc.data().title || `Spot ${doc.id}`,
  //       status: doc.data().status,
  //       timestamp: doc.data().timestamp,
  //     }));
  //     setSpotsDatabase(spots);
  //   } catch (error) {
  //     Alert.alert("Error", `Failed to load spots: ${error.message}`);
  //   }
  // };
  // useEffect(() => {
  //   fetchSpots();
  // }, []);

  useEffect(() => {
    const initializeParkAndRide = async () => {
      try {
        showLoader();

        const parkAndRideData =
          await ParkAndRideSqliteService.fetchSelectedData();
        setPark_and_ride(parkAndRideData);
        // console.log("park_and_ride", park_and_ride);
        // console.log("park_and_ride initialized successfully.");
      } catch (error) {
        console.error("ParkAndRide initialization failed:", error);
      } finally {
        hideLoader();
      }
    };
    if (isParkAndRideDatabaseInitialized) {
      initializeParkAndRide();
    }
  }, [isParkAndRideDatabaseInitialized]);

  useEffect(() => {
    const initializePublicParking = async () => {
      try {
        showLoader();

        const publicParkingData =
          await PublicParkingSqliteService.fetchSelectedData();
        setPublic_parking(publicParkingData);
        // console.log("public_parking", public_parking);
        // console.log("public_parking initialized successfully.");
      } catch (error) {
        console.error("PublicParking initialization failed:", error);
      } finally {
        hideLoader();
      }
    };

    if (isPublicParkingDatabaseInitialized) {
      initializePublicParking();
    }
  }, [isPublicParkingDatabaseInitialized]);

  useEffect(() => {
    const fetchVisibleParkingSpaces = async () => {
      try {
        showLoader();

        if (region.latitudeDelta <= 0.015 && region.longitudeDelta <= 0.015) {
          const visibleParkingSpaces =
            await ParkingSpacesSqliteService.fetchVisibleData(region, 2);
          setOn_street_parking(visibleParkingSpaces);
          // console.log("visible data", visibleParkingSpaces);
          // console.log("park_and_ride", park_and_ride);
          // console.log("public_parking", public_parking);
          // console.log("gorunur data eklendi");
        } else {
          // console.log("lokasyonlari gormek için haritayi yakinlastir");
        }

        // console.log("ParkingSpaces initialized successfully.");
      } catch (error) {
        console.error(
          "fetchVisibleParkingSpaces initialization failed:",
          error
        );
      } finally {
        hideLoader();
      }
    };

    if (isParkingSpacesDatabaseInitialized) {
      fetchVisibleParkingSpaces();
    }
  }, [region, isParkingSpacesDatabaseInitialized, routeCoordinates]);

  //Update document

  // example code

  const handleUpdateSpot = () => {
    const spotId = "spot123";

    // updated spot informations
    const updatedData = {
      title: "Updated Spot Title",
      status: "unavailable",
      timestamp: new Date().toISOString(),
      //timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    updateSpot(spotId, updatedData);
  };

  const updateSpot = async (spotId, updatedData) => {
    try {
      const spotRef = doc(firestoreDB, "spots", spotId);

      await updateDoc(spotRef, updatedData);
      Alert.alert("Success", "Spot has been updated successfully.");
    } catch (error) {
      Alert.alert("Error", `Failed to update spot: ${error.message}`);
    }
  };

  // Menü açma/kapama
  const toggleAccountMenu = () => {
    Animated.timing(slideAnim, {
      toValue: showAccountMenu ? -Dimensions.get("window").width * 0.6 : 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setShowAccountMenu(!showAccountMenu));
  };

  // Çıkış yapma
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(firebaseAuth);
      Alert.alert("Logged Out", "You have successfully logged out.");
      navigation.replace("FrontPage");
    } catch (error) {
      Alert.alert("Logout Failed", `Error: ${error.message}`);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={toggleAccountMenu}>
              <Ionicons name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>

            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a location"
                onChangeText={setSearchText}
                onSubmitEditing={() => {
                  handleSearch();
                  setRouteCoordinates([]);
                  setRouteInfo({});
                }}
                value={searchText}
                onFocus={() => setIsSearched(false)}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
              >
                <Ionicons name="search" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {searchedSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={searchedSuggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              {searchedSuggestions.length > 0 && (
                <View style={styles.scrollHint}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={24}
                    color="gray"
                  />
                </View>
              )}
            </View>
          )}

          {searchText &&
            !isSearchedSuggestions &&
            searchedSuggestions.length === 0 &&
            isSearched && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No result, please search again
                  </Text>
                </View>
              </View>
            )}

          {navigationStepsInstnstruction && (
            <View style={styles.suggestionsContainer}>
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {navigationStepsInstnstruction}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* <Animated.View
          style={[
            styles.accountMenu,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleAccountMenu}
          >
            <View style={styles.closeButtonContainer}>
              <Ionicons name="close" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.topSection}>
            <Text style={styles.accountText}>User Menu</Text>
          </View>

          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/Profile.png")}
              style={styles.avatar}
            />
          </View>

          <View style={styles.middleSection}>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.navigate("TestProfilePage")}
            >
              <Text style={styles.menuButtonText}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>My Points</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View> */}

        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          // region={region}
          onRegionChangeComplete={setRegion}
        >
          {userCurrentLocation && (
            <Marker
              coordinate={userCurrentLocation}
              title="Your Location"
              opacity={1}
            >
              <Image
                source={require("../../assets/car4.png")}
                style={styles.markerImage}
              />
            </Marker>
          )}

          {/* {spotsDatabase.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              title={spot.title}
              pinColor={spot.status === "available" ? "green" : "red"}
            />
          ))} */}

          {public_parking.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name_du}
              description={`Capacity (Car): ${item.capacity_car}`}
              image={require("../../assets/parking40.png")}
              onPress={() => {
                handleDirection(item.longitude, item.latitude);
                console.log(
                  `public parking selected latitude: ${item.latitude}, longitude: ${item.longitude}`
                );
              }}
              opacity={1}
            ></Marker>
          ))}

          {park_and_ride.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name_du}
              description={` Capacity (Car): ${item.capacity_car}`}
              image={require("../../assets/parking40.png")}
              onPress={() => {
                handleDirection(item.longitude, item.latitude);
              }}
              opacity={1}
            ></Marker>
          ))}

          {!navigationIntervalId &&
            on_street_parking.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={`Status: ${item.status}`}
                description={`Last Change: ${new Date(
                  item.timestamp
                ).toLocaleString()}`}
                pinColor={
                  item.status === "unknown"
                    ? "gray"
                    : item.status === "available"
                    ? "green"
                    : "red"
                }
                opacity={1}
                onPress={() => {
                  handleDirection(item.longitude, item.latitude);
                }}
              />
            ))}

          {searchedLocations.length > 0 &&
            searchedLocations.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  longitude: item.coordinates[0],
                  latitude: item.coordinates[1],
                }}
                title={item.name}
                description={item.label}
                onPress={() => {
                  handleSuggestionSelect(item);
                  handleDirection(item.coordinates[0], item.coordinates[1]);
                }}
                opacity={1}
              >
                <MaterialIcons name="location-pin" size={50} color="purple" />
              </Marker>
            ))}

          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}

          {/* {routeSteps[currentStep] && (
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
              <View style={styles.navigationBox}>
                <TouchableOpacity
                  style={styles.navigationCloseButton}
                  onPress={() => {
                    setRouteCoordinates([]);
                    setRouteSteps([]);
                   
                  }}
                >
                  <MaterialIcons name="close" size={20} color="red" />
                </TouchableOpacity>
                <Text style={styles.navigationText}>
                  {routeSteps[currentStep].instruction}
                </Text>
              </View>
            </Marker>
          )} */}

          {/* {routeInfo && (
            <Marker
              coordinate={
                routeCoordinates[routeCoordinates.length - 1]
              }
            >
              <View style={styles.routeInfoContainer}>
                <Text style={styles.routeInfoText}>
                  {`Distance: ${routeInfo.distance}`}
                </Text>
                <Text style={styles.routeInfoText}>
                  {`Duration: ${routeInfo.duration}`}
                </Text>
              </View>
            </Marker>
          )} */}

          {/* routeCoordinates.length - 1 */}

          {/* {routeInfo && (
            <Marker coordinate={routeCoordinates[0]}> 
              <View style={styles.routeInfoContainer}>
                <TouchableOpacity
                  style={styles.closeRouteInfoButton}
                  onPress={() => {
                    setRouteCoordinates([]);
                    setRouteInfo(null);
                    goToUserLocation();
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>

              
                <Text style={styles.routeInfoText}>
                  {`Distance: ${routeInfo.distance}`}
                </Text>
                <Text style={styles.routeInfoText}>
                  {`Duration: ${routeInfo.duration}`}
                </Text>
              </View>
            </Marker>
          )} */}
        </MapView>

        <Animated.View
          style={[
            styles.rightcornerButtonsContainer,
            { transform: [{ translateY: rightCornerTranslateY }] },
          ]}
        >
          <TouchableOpacity
            style={styles.alignHeadingButton}
            onPress={() => setIsAligningHeading(!isAligningHeading)}
          >
            <MaterialIcons
              name={isAligningHeading ? "navigation" : "explore"}
              size={24}
              color="black"
            />
            {/* <Ionicons name={isAligningHeading ? "compass" : "compass-outline"} size={24} color="#black" /> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapRefreshButton}
            onPress={deleteDatabases}
          >
            <MaterialIcons name="delete" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapRefreshButton}
            onPress={handleMapRefresher}
          >
            <Ionicons name="refresh" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navigationSoundButton}
            onPress={() => setIsNavigationSoundOn(!isNavigationSoundOn)}
          >
            <Ionicons
              name={
                isNavigationSoundOn
                  ? "volume-high-outline"
                  : "volume-mute-outline"
              }
              size={24}
              color={"black"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={goToUserLocation}
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </Animated.View>

        {activeModule === "navigationModal" && (
          <Animated.View
            style={[
              styles.navigationModalContainer,
              { transform: [{ translateY }] },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.navigationModalHandle} />

            <View style={styles.navigationModalTextContainer}>
              <Text style={styles.navigationModalText}>
                Distance: {routeInfo.distance} km
              </Text>
              <Text style={styles.navigationModalText}>
                Duration: {routeInfo.duration} mins
              </Text>
            </View>

            <View style={styles.navigationModalButtons}>
              <TouchableOpacity
                style={styles.navigationStartButton}
                onPress={startNavigation}
              >
                <Text style={styles.navigationStartButtonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navigationCancelButton}
                onPress={resetNavigation}
              >
                <Text style={styles.navigationCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",

    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  accountMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "60%",
    backgroundColor: "#fff",
    zIndex: 2,
    padding: 20,
    elevation: 5,
  },
  closeButtonContainer: {
    borderColor: "red",
    padding: 2,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "red",
  },
  closeRouteInfoButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  topSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  avatar: {
    width: "80%",
    height: 150,
    borderRadius: 20,
  },
  middleSection: {
    flex: 1,
  },
  bottomSection: {
    alignItems: "center",
  },
  menuButton: {
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  markerImage: {
    width: 40,
    height: 40,
  },
  showZoomMessageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -50 }],
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    borderRadius: 10,
    zIndex: 1000,
    width: 300,
  },
  showZoomMessageText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "column",
  },
  rightcornerButtonsContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  mapRefreshButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  navigationSoundButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white",
    elevation: 3,
    marginBottom: 10,
    borderWidth: 1,
  },
  locationButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  alignHeadingButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginLeft: 10,
    overflow: "hidden",
  },
  searchButton: {
    height: 40,
    width: 40,
    // backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollHint: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    alignItems: "center",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  emptyText: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "gray",
  },
  routeInfoContainer: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderColor: "gray",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 50,
  },
  routeInfoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  routeInfoContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 100,
    zIndex: 10,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  closeRouteInfoButton: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 10,
  },

  navigationModalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "20%",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationModalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },

  navigationModalTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navigationModalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#B2DDF9",
  },
  navigationModalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  navigationStartButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  navigationStartButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  navigationCancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  navigationCancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
