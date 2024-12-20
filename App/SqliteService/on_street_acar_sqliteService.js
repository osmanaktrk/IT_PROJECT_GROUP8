import * as SQLite from "expo-sqlite";
import proj4 from "proj4";
//import geoJsonData from "../ApiService/on_street_acar.json";
proj4.defs(
  "EPSG:31370",
  "+proj=lcc +lat_1=49.8333339 +lat_2=51.16666723333333 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,-0.33657,0.456955,-1.84218,1 +units=m +no_defs"
);

// create a new SQLite database
const db = SQLite.openDatabaseAsync("geojson.db");