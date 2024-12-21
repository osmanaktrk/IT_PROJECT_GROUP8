import * as SQLite from "expo-sqlite";
import proj4 from "proj4";
//import geoJsonData from "../ApiService/on_street_acar.json";
proj4.defs(
  "EPSG:31370",
  "+proj=lcc +lat_1=49.8333339 +lat_2=51.16666723333333 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,-0.33657,0.456955,-1.84218,1 +units=m +no_defs"
);

// create a new SQLite database
const db = SQLite.openDatabaseSync("on_street_acar.db");



export const createDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
}


// create a new table in the database
export const createTable = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  await db.execAsync(
    `PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS on_street_acar (
          id INTEGER PRIMARY KEY,
          fid INTEGER,
          latitude REAL,
          longitude REAL,
          building_type INTEGER,
          setback_zone INTEGER,
          typacar INTEGER,
          evp INTEGER,
          si_id INTEGER,
          typreg INTEGER,
          niscode TEXT,
          city_id INTEGER,
          sd_id INTEGER,
          md_id INTEGER,
          status TEXT DEFAULT 'unknown',
          timestamp TEXT DEFAULT '0001-01-01T00:00:00.000Z'
      );`
  );

};



// insert data into the SQLite database
export const insertDataIntoSQLite = async (geoJsonData) => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  const preparedData = geoJsonData.features.map((feature) => {
    const [longitude, latitude] = proj4(
      "EPSG:31370",
      "EPSG:4326",
      feature.geometry.coordinates[0]
    );
    const {
      id,
      fid,
      building_type,
      setback_zone,
      typacar,
      evp,
      si_id,
      typreg,
      niscode,
      city_id,
      sd_id,
      md_id,
    } = feature.properties;

    const status = "unknown"; 
    const timestamp = "0001-01-01T00:00:00.000Z"; 

    return [
      id,
      fid,
      latitude,
      longitude,
      building_type,
      setback_zone,
      typacar,
      evp,
      si_id,
      typreg,
      niscode,
      city_id,
      sd_id,
      md_id,
      status || "unknown",
      timestamp || "0001-01-01T00:00:00.000Z",
    ];

  });

  preparedData.forEach((data) => {
    db.runAsync(
      `INSERT INTO on_street_acar (
            id,
            fid,
            latitude,
            longitude,
            building_type,
            setback_zone,
            typacar,
            evp,
            si_id,
            typreg,
            niscode,
            city_id,
            sd_id,
            md_id,
            status,
            timestamp
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          data
    );
  });

};


// fetch all data from the SQLite database
export const fetchAllData = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  const result = await db.getAllAsync("SELECT * FROM on_street_acar");

  return result;
};


// fetch data from the SQLite database based on the visible region

export const fetchVisibleData = async (region, expansionFactor = 1) => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const expandedLatitudeDelta = latitudeDelta * expansionFactor;
  const expandedLongitudeDelta = longitudeDelta * expansionFactor;

  const northEastLat = latitude + expandedLatitudeDelta / 2;
  const northEastLng = longitude + expandedLongitudeDelta / 2;
  const southWestLat = latitude - expandedLatitudeDelta / 2;
  const southWestLng = longitude - expandedLongitudeDelta / 2;

  const result = db.getAllAsync(
    `SELECT * FROM on_street_acar WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?`,
    [southWestLat, northEastLat, southWestLng, northEastLng]
  );

  return result;
};

// clear the SQLite database
export const clearDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  await db.execAsync(`DROP TABLE IF EXISTS on_street_acar`);
};


export const deleteDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("on_street_acar.db");
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("on_street_acar.db");
  console.log("Database deleted");
};
//initialize the SQLite database
export const initializeDatabase = async () => {
  await createTable();
  await insertDataIntoSQLite(geoJsonData);
  
};