import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('spots.db');

export const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        latitude REAL, 
        longitude REAL, 
        status TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('Table created successfully!'),
      (tx, error) => console.error('Error creating table:', error)
    );
  });
};

export const addLocation = (latitude, longitude, status) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO Locations (latitude, longitude, status) VALUES (?, ?, ?);`,
      [latitude, longitude, status],
      () => console.log('Location added successfully!'),
      (tx, error) => console.error('Error adding location:', error)
    );
  });
};



export const updateLocationStatus = (latitude, longitude, status) => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Locations SET status = ?, timestamp = CURRENT_TIMESTAMP WHERE latitude = ? AND longitude = ?;`,
        [status, latitude, longitude],
        () => console.log('Location status updated successfully!'),
        (tx, error) => console.error('Error updating status:', error)
      );
    });
  };

export const getAllLocations = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM Locations;`,
      [],
      (_, { rows: { _array } }) => callback(_array),
      (tx, error) => console.error('Error fetching locations:', error)
    );
  });
};

export const getLocationById = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM Locations WHERE id = ?;`,
      [id],
      (_, { rows: { _array } }) => callback(_array[0]),
      (tx, error) => console.error('Error fetching location:', error)
    );
  });
};


createTable();
