import * as SQLite from "expo-sqlite";
import proj4 from "proj4";
import geoJsonData from "../ApiService/park_and_ride.json";
proj4.defs(
  "EPSG:31370",
  "+proj=lcc +lat_1=49.8333339 +lat_2=51.16666723333333 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,-0.33657,0.456955,-1.84218,1 +units=m +no_defs"
);

// create a new SQLite database
const db = SQLite.openDatabaseAsync("park_and_ride.db");

// create a new table in the database
export const createTable = async () => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  await db.execAsync(
    `PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS park_and_ride (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL,
        longitude REAL,
        name_fr TEXT,
        name_du TEXT,
        street_fr TEXT,
        street_du TEXT,
        housenr TEXT,
        city_fr TEXT,
        city_du TEXT,
        capacity_car INTEGER,
        capacity_bike INTEGER,
        url TEXT,
        city_id INTEGER,
        sd_id INTEGER,
        lez INTEGER
      );`
  );
};

// insert data into the SQLite database
export const insertDataIntoSQLite = async (geoJsonData) => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  const preparedData = geoJsonData.features.map((feature) => {
    const [longitude, latitude] = proj4(
      "EPSG:31370",
      "EPSG:4326",
      feature.geometry.coordinates[0]
    );
    const {
      name_fr,
      name_du,
      street_fr,
      street_du,
      housenr,
      city_fr,
      city_du,
      capacity_car,
      capacity_bike,
      url,
      city_id,
      sd_id,
      lez,
    } = feature.properties;
    return [
      latitude,
      longitude,
      name_fr,
      name_du,
      street_fr,
      street_du,
      housenr || null,
      city_fr,
      city_du,
      capacity_car || 0,
      capacity_bike || 0,
      url,
      city_id,
      sd_id,
      lez,
    ];
  });

  preparedData.forEach((data) => {
    db.runAsync(
      `INSERT INTO park_and_ride (
          latitude,
          longitude,
          name_fr,
          name_du,
          street_fr,
          street_du,
          housenr,
          city_fr,
          city_du,
          capacity_car,
          capacity_bike,
          url,
          city_id,
          sd_id,
          lez
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      data
    );
  });

};

// // fetch all data from the SQLite database
export const fetchAllData = async () => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  const result = await db.getAllAsync("SELECT * FROM park_and_ride");

  return result;
};

// fetch data from the SQLite database based on the visible region
export const fetchVisibleData = async (region) => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

  const northEastLat = latitude + latitudeDelta / 2;
  const northEastLng = longitude + longitudeDelta / 2;
  const southWestLat = latitude - latitudeDelta / 2;
  const southWestLng = longitude - longitudeDelta / 2;

  const result = db.getAllAsync(
    `SELECT * FROM park_and_ride WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
    [southWestLat, northEastLat, southWestLng, northEastLng]
  );

  return result;
};

// clear the SQLite database
export const clearDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
  await db.execAsync(`DROP TABLE IF EXISTS park_and_ride`);
};

export const initializeDatabase = () => {
  createTable();
  insertDataIntoSQLite(geoJsonData);
};
