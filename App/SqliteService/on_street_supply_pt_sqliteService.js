import * as SQLite from "expo-sqlite";
import proj4 from "proj4";
//import geoJsonData from "../ApiService/on_street_supply_pt.json";
proj4.defs(
  "EPSG:31370",
  "+proj=lcc +lat_1=49.8333339 +lat_2=51.16666723333333 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,-0.33657,0.456955,-1.84218,1 +units=m +no_defs"
);

// create a new SQLite database
const db = SQLite.openDatabaseAsync("geojson.db");

// create a new table in the database
export const createTable = async () => {
  await db.execAsync(`CREATE TABLE IF NOT EXISTS geojson (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          latitude REAL,
          longitude REAL,
          typreg INTEGER,
          typres INTEGER,
          evp INTEGER,
          city_id INTEGER
        );`);
};


// insert data into the SQLite database
export const insertDataIntoSQLite = async (geoJsonData) => {
  const preparedData = geoJsonData.features.map((feature) => {
    const [longitude, latitude] = proj4(
      "EPSG:31370",
      "EPSG:4326",
      feature.geometry.coordinates[0]
    );
    const { typreg, typres, evp, city_id } = feature.properties;
    return [latitude, longitude, typreg, typres, evp, city_id];
  });

  preparedData.forEach(
    ([latitude, longitude, typreg, typres, evp, city_id]) => {
      db.runAsync(
        `INSERT INTO geojson (latitude, longitude, typreg, typres, evp, city_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [latitude, longitude, typreg, typres, evp, city_id]
      );
    }
  );
};

// fetch all data from the SQLite database
export const fetchAllData = async () => {
  const result = await db.getAllAsync("SELECT * FROM geojson");

  return result;
};

// fetch data from the SQLite database based on the visible region

export const fetchVisibleData = async (region, expansionFactor = 1) => {
  const db = await SQLite.openDatabaseAsync("park_and_ride.db");
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

  await db.execAsync(`DROP TABLE IF EXISTS geojson`);
  
};


export const initializeDatabase = () => {
  createTable();
  insertDataIntoSQLite();
  console.log("Database initialized successfully");
};