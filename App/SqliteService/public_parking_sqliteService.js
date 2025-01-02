import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const setupSQLiteDatabase = async () => {
  try {
 
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dbPath = `${sqliteDir}/public_parking.db`;

    //  const sqliteDir = SQLite.defaultDatabaseDirectory;
    //  const dbPath = `${SQLite.defaultDatabaseDirectory}/public_parking.db`;

    console.log("SQLite directory:", sqliteDir);
    console.log("Database path:", dbPath);

    const public_parking = await AsyncStorage.getItem("public_parking");

    if (public_parking === "true") {
      console.log("Database setup already completed. Skipping...");
      return;
    }

    if (!FileSystem.documentDirectory) {
      console.log("FileSystem.documentDirectory is not accessible.");
    }

    const pathExists = (await FileSystem.getInfoAsync(sqliteDir)).exists;
    if (!pathExists) {
      console.log("SQLite directory does not exist. Creating...");
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
      console.log("SQLite directory created.");
    }

    const asset = Asset.fromModule(
      require("../../assets/Database/public_parking.db")
    );
    // await Asset.loadAsync(asset);
    await asset.downloadAsync();
    console.log("Asset localUri:", asset.localUri);

    await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
    console.log("Database copied to local directory.");

    await AsyncStorage.setItem("public_parking", "true");

    return true;
  } catch (error) {
    console.error("Error setting up SQLite database:", error);
    await AsyncStorage.setItem("public_parking", "false");
  }
};

const db = SQLite.openDatabaseSync("public_parking.db");
export const createDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("public_parking.db");
  return db;
};

// fetch all data from the SQLite database
export const fetchAllData = async () => {
  const db = await createDatabase();
  const result = await db.getAllAsync("SELECT * FROM public_parking");

  return result;
};

export const fetchSelectedData = async () => {
  const db = await createDatabase();
  const result = await db.getAllAsync(
    "SELECT latitude, longitude, name_du, capacity_car, status, timestamp FROM public_parking"
  );

  return result;
};

// fetch data from the SQLite database based on the visible region

export const fetchVisibleData = async (region, expansionFactor = 1) => {
  const db = await createDatabase();
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const expandedLatitudeDelta = latitudeDelta * expansionFactor;
  const expandedLongitudeDelta = longitudeDelta * expansionFactor;

  const northEastLat = latitude + expandedLatitudeDelta / 2;
  const northEastLng = longitude + expandedLongitudeDelta / 2;
  const southWestLat = latitude - expandedLatitudeDelta / 2;
  const southWestLng = longitude - expandedLongitudeDelta / 2;

  const result = db.getAllAsync(
    `SELECT * FROM public_parking WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
    [southWestLat, northEastLat, southWestLng, northEastLng]
  );

  return result;
};

// clear the SQLite database
export const clearDatabase = async () => {
  const db = await createDatabase();
  await db.execAsync(`DROP TABLE IF EXISTS public_parking`);
  console.log("public_parking Database cleared");
};

export const deleteDatabase = async () => {
  const db = await createDatabase();
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("public_parking.db");
  console.log("public_parking Database deleted");
};

//initialize the SQLite database
export const initializeDatabase = async (showLoader, hideLoader) => {
  try {
    showLoader();
    const databaseInitialResult = await setupSQLiteDatabase();
    const db = await createDatabase();
    const result = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='public_parking';"
    );

    if (result.length === 0) {
      console.log(
        "public_parking Database not initialized. Initializing now..."
      );
      await setupSQLiteDatabase();
      const db = await createDatabase();
      console.log("public_parking insert data.");
    } else {
      console.log("public_parking Database already initialized.");
    }
    return true;
  } catch (error) {
    console.error(
      "public_parking Error during database initialization check:",
      error
    );
    return false;
  } finally {
    hideLoader();
  }
};
