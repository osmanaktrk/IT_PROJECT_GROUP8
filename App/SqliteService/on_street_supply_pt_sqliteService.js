import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { GeoPoint } from "firebase/firestore";
import { firestoreDB } from "../../FirebaseConfig";

export const setupSQLiteDatabase = async () => {
  const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
  const dbPath = `${FileSystem.documentDirectory}SQLite/on_street_supply_pt.db`;

  // const sqliteDir = SQLite.defaultDatabaseDirectory;
  // const dbPath = `${SQLite.defaultDatabaseDirectory}/on_street_supply_pt.db`;

  const pathExists = (await FileSystem.getInfoAsync(sqliteDir)).exists;
  console.log("pathExists on_street_supply_pt", pathExists);

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
  return true;
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

export const fetchAllDataFromFirestore = async () => {
  try {
    const collectionRef = collection(firestoreDB, "on_street_supply_pt");
    const querySnapshot = await getDocs(collectionRef);

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    console.log(`Fetched ${results.length} documents from Firestore.`);

    return results;
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return [];
  }
};


export const fetchStatusDataFromFirestore = async (status) => {
  const db = getFirestore();
  const collectionRef = collection(db, "on_street_supply_pt");

  const queryRef = query(collectionRef, where("status", "==", status));
  const querySnapshot = await getDocs(queryRef);

  const results = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      latitude: data.coords.latitude,
      longitude: data.coords.longitude,
      price: data.price,
      status: data.status,
      timestamp: data.timestamp.toDate().toISOString(),
      userID: data.userID,
    };
  });
  console.log(`${status}`, results);

  return results;
};

// export const fetchAvailableDataFromFirestore = async () => {
//   try {
//     const queryRef = query(
//       collection(firestoreDB, "on_street_supply_pt"),
//       where("status", "==", "available")
//     );

//     const querySnapshot = await getDocs(queryRef);
//     const results = [];
//     querySnapshot.forEach((doc) => {
//       results.push({ id: doc.id, ...doc.data() });
//     });

//     console.log("Available Data from firestore :", results);
//     return results;
//   } catch (error) {
//     console.error("Error fetching available data:", error);
//     return [];
//   }
// };

export const updateSQLiteWithAvailableRecords = async () => {
  const db = await createDatabase();

  try {
    const availableData = await fetchStatusDataFromFirestore("available");

    const updateQuery = `
      UPDATE on_street_supply_pt
      SET status = ?, timestamp = ?, userID = ?
      WHERE latitude = ? AND longitude = ?
    `;

    for (const record of availableData) {
      await db.runAsync(updateQuery, [
        record.status,
        record.timestamp,
        record.userID,
        record.latitude,
        record.longitude,
      ]);
    }

    console.log(
      `SQLite database updated with ${availableData.length} 'available' records.`
    );
  } catch (error) {
    console.error("Error updating 'available' records:", error.message);
  }
};

// export const fetchUnavailableDataFromFirestore = async () => {
//   try {
//     const queryRef = query(
//       collection(firestoreDB, "on_street_supply_pt"),
//       where("status", "==", "unavailable")
//     );

//     const querySnapshot = await getDocs(queryRef);
//     const results = [];
//     querySnapshot.forEach((doc) => {
//       results.push({ id: doc.id, ...doc.data() });
//     });

//     console.log("Unavailable Data fron firestore:", results);
//     return results;
//   } catch (error) {
//     console.error("Error fetching unavailable data:", error);
//     return [];
//   }
// };

export const updateSQLiteWithUnavailableRecords = async () => {
  const db = await createDatabase();

  try {
  
    const unavailableData = await fetchStatusDataFromFirestore("unavailable")

   
    const updateQuery = `
      UPDATE on_street_supply_pt
      SET status = ?, timestamp = ?, userID = ?
      WHERE latitude = ? AND longitude = ?
    `;

    for (const record of unavailableData) {
      await db.runAsync(updateQuery, [
        record.status,
        record.timestamp,
        record.userID,
        record.latitude,
        record.longitude,
      ]);
    }

    console.log(
      `SQLite database updated with ${unavailableData.length} 'unavailable' records.`
    );
  } catch (error) {
    console.error("Error updating 'unavailable' records:", error.message);
  }
};

export const fetchVisibleDataFromFirestore = async (
  region,
  expansionFactor = 1.5
) => {
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const expandedLatitudeDelta = latitudeDelta * expansionFactor;
  const expandedLongitudeDelta = longitudeDelta * expansionFactor;

  const northEastLat = latitude + expandedLatitudeDelta / 2;
  const northEastLng = longitude + expandedLongitudeDelta / 2;
  const southWestLat = latitude - expandedLatitudeDelta / 2;
  const southWestLng = longitude - expandedLongitudeDelta / 2;

  try {
    // Firestore sorgusu
    const collectionRef = collection(firestoreDB, "on_street_supply_pt");

    const q = query(
      collectionRef,
      where("coords", ">=", new GeoPoint(southWestLat, southWestLng)),
      where("coords", "<=", new GeoPoint(northEastLat, northEastLng))
    );

    const querySnapshot = await getDocs(q);
    const results = [];

    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
    return [];
  }
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

    const databaseInitialResult = await setupSQLiteDatabase();
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
      console.log("on_street_supply_pt insert Database.");
    } else {
      console.log("on_street_supply_pt Database already initialized.");
    }

    return databaseInitialResult;
  } catch (error) {
    console.error(
      "on_street_supply_pt Error during database initialization check:",
      error
    );
    return false;
  } finally {
    hideLoader();
  }
};
