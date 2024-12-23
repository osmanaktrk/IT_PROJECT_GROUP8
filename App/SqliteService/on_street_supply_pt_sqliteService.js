import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export const setupSQLiteDatabase = async () => {
  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${FileSystem.documentDirectory}SQLite/on_street_supply_pt.db`;

  const pathExists = (await FileSystem.getInfoAsync(sqliteDir)).exists;

  if (!pathExists) {
    await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
  }

  const fileExists = (await FileSystem.getInfoAsync(dbPath)).exists;
  if (!fileExists) {
    const asset = Asset.fromModule(
      require("../../assets/Database/on_street_supply_pt.db")
    );
    await asset.downloadAsync();

    await FileSystem.copyAsync({ from: asset.localUri, to: dbPath });
    console.log("Database copied to local directory.");
  } else {
    console.log("Database already exists in local directory.");
  }
};

export const createDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_supply_pt.db");
  return db;
};

// fetch all data from the SQLite database
export const fetchAllData = async () => {
  const db = await createDatabase();
  const result = await db.getAllAsync("SELECT * FROM on_street_supply_pt");
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
    `SELECT * FROM on_street_supply_pt WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
    [southWestLat, northEastLat, southWestLng, northEastLng]
  );

  return result;
};

// clear the SQLite database
export const clearDatabase = async () => {
  const db = await createDatabase();
  await db.execAsync(`DROP TABLE IF EXISTS on_street_supply_pt`);
  console.log("on_street_supply_pt Database cleared");
};

export const deleteDatabase = async () => {
  const db = await createDatabase();
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("on_street_supply_pt.db");
  console.log("on_street_supply_pt Database deleted");
};

// initialize the SQLite database
export const initializeDatabase = async (showLoader, hideLoader) => {
  try {
    showLoader();
    await setupSQLiteDatabase();
    const db = await createDatabase();

    const result = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='on_street_supply_pt';"
    );

    if (result.length === 0) {
      console.log(
        "on_street_supply_pt Database not initialized. Initializing now..."
      );
      await setupSQLiteDatabase();
      const db = await createDatabase();
    } else {
      console.log("on_street_supply_pt Database already initialized.");
    }
  } catch (error) {
    console.error(
      "on_street_supply_pt Error during database initialization check:",
      error
    );
    throw error;
  } finally {
    hideLoader();
  }
};
