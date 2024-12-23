import React, { createContext, useState, useContext } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoaderContext = createContext();

const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => {
    console.log("Loader shown");
    setIsLoading(true);
  };

  const hideLoader = () => {
    console.log("Loader hidden");
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && (
        <View style={styles.overlay} pointerEvents="box-none">
          <ActivityIndicator size="large" color="#406f8f" />
          <Text style={styles.text}>Loading data, please wait</Text>
        </View>
      )}
    </LoaderContext.Provider>
  );
};

const useLoader = () => useContext(LoaderContext);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 9999,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#406f8f",
    fontWeight: "bold",
  },
});

export { LoaderProvider, useLoader };