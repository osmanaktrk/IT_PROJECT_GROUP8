import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export const setupSQLiteDatabase = async () => {
  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${FileSystem.documentDirectory}SQLite/park_and_ride.db`;

  const pathExists = (await FileSystem.getInfoAsync(sqliteDir)).exists;

  if (!pathExists) {
    await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
  }

  const fileExists = (await FileSystem.getInfoAsync(dbPath)).exists;
  if (!fileExists) {
    const asset = Asset.fromModule(
      require("../../assets/Database/park_and_ride.db")
    );
    await asset.downloadAsync();

    await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
    console.log("Database copied to local directory.");
  } else {
    console.log("Database already exists in local directory.");
  }
};

export const createDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  return db;
};

//fetch all data from the SQLite database
export const fetchAllData = async () => {
  const db = await createDatabase();
  const result = await db.getAllAsync("SELECT * FROM park_and_ride");

  return result;
};

export const fetchSelectedData = async () => {
  const db = await createDatabase();
  const result = await db.getAllAsync(
    "SELECT latitude, longitude, name_du, capacity_car, status, timestamp FROM park_and_ride"
  );
  return result;
};

// fetch data from the SQLite database based on the visible region
export const fetchVisibleData = async (region, expansionFactor = 1.5) => {
  const db = await createDatabase();
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const expandedLatitudeDelta = latitudeDelta * expansionFactor;
  const expandedLongitudeDelta = longitudeDelta * expansionFactor;

  const northEastLat = latitude + expandedLatitudeDelta / 2;
  const northEastLng = longitude + expandedLongitudeDelta / 2;
  const southWestLat = latitude - expandedLatitudeDelta / 2;
  const southWestLng = longitude - expandedLongitudeDelta / 2;

  const result = db.getAllAsync(
    `SELECT * FROM park_and_ride WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
    [southWestLat, northEastLat, southWestLng, northEastLng]
  );

  return result;
};

// clear the SQLite database
export const clearDatabase = async () => {
  const db = await createDatabase();
  await db.execAsync(`DROP TABLE IF EXISTS park_and_ride`);
  console.log("park_and_ride Database cleared");
};

export const deleteDatabase = async () => {
  const db = await createDatabase();
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("park_and_ride.db");
  console.log("park_and_ride Database deleted");
};



export const initializeDatabase = async (showLoader, hideLoader) => {
  try {
    showLoader();
    await setupSQLiteDatabase();
    const db = await createDatabase();

    const result = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='park_and_ride';"
    );

    if (result.length === 0) {
      console.log(
        "park_and_ride Database not initialized. Initializing now..."
      );
      await setupSQLiteDatabase();
      const db = await createDatabase();

      console.log("park_and_ride insert Database.");
    } else {
      console.log("park_and_ride Database already initialized.");
    }
    
  } catch (error) {
    console.error(
      "park_and_ride Error during database initialization check:",
      error
    );
    throw error;
  } finally {
    hideLoader();
  }
};
