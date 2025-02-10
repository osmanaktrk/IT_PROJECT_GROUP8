import axios from "axios";

//Source of all explanations: https://openrouteservice.org/dev/#/api-docs

const OpenRouteServiceApiKey ="";

//Calculates the driving route between two points.
// Get a basic route between two points with the profile provided.
// Returned response is in GeoJSON format.
// This method does not accept any request body or parameters other than
// profile, start coordinate, and end coordinate.

export const directionsServise = async (
  originLongitude,
  originLatitude,
  destinationLongitude,
  destinationLatitude
) => {
  try {
    // const response = await axios.get(
    //   `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OpenRouteServiceApiKey}&start=${originLongitude},${originLatitude}&end=${destinationLongitude},${destinationLatitude}`
    // );

    const response = await axios.get(
      `https://api.openrouteservice.org/v2/directions/driving-car`,
      {
        params: {
          start: `${originLongitude},${originLatitude}`,
          end: `${destinationLongitude},${destinationLatitude}`,
          api_key: OpenRouteServiceApiKey,
        },
        headers: {
          Accept: "application/json, application/geo+json",
        },
      }
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in directionServise:", error);
    
  }

  // sample output

  //originLongitude:8.681495,
  //originLatitude:49.41461
  //destinationLongitude:8.687872
  //destinationLatitude:49.420318

  //   {
  //     "type": "FeatureCollection",
  //     "bbox": [8.681423, 49.414599, 8.690123, 49.420514],
  //     "features": [
  //       {
  //         "bbox": [8.681423, 49.414599, 8.690123, 49.420514],
  //         "type": "Feature",
  //         "properties": {
  //           "segments": [
  //             {
  //               "distance": 1408.8,
  //               "duration": 281.9,
  //               "steps": [
  //                 {
  //                   "distance": 1.8,
  //                   "duration": 0.4,
  //                   "type": 11,
  //                   "instruction": "Head west on Gerhart-Hauptmann-Straße",
  //                   "name": "Gerhart-Hauptmann-Straße",
  //                   "way_points": [0, 1]
  //                 },
  //                 {
  //                   "distance": 313.8,
  //                   "duration": 75.3,
  //                   "type": 1,
  //                   "instruction": "Turn right onto Wielandtstraße",
  //                   "name": "Wielandtstraße",
  //                   "way_points": [1, 6]
  //                 },
  //                 {
  //                   "distance": 500.8,
  //                   "duration": 76.4,
  //                   "type": 1,
  //                   "instruction": "Turn right onto Mönchhofstraße",
  //                   "name": "Mönchhofstraße",
  //                   "way_points": [6, 17]
  //                 },
  //                 {
  //                   "distance": 251.9,
  //                   "duration": 60.5,
  //                   "type": 0,
  //                   "instruction": "Turn left onto Erwin-Rohde-Straße",
  //                   "name": "Erwin-Rohde-Straße",
  //                   "way_points": [17, 21]
  //                 },
  //                 {
  //                   "distance": 126.8,
  //                   "duration": 30.4,
  //                   "type": 1,
  //                   "instruction": "Turn right onto Moltkestraße",
  //                   "name": "Moltkestraße",
  //                   "way_points": [21, 22]
  //                 },
  //                 {
  //                   "distance": 83,
  //                   "duration": 7.5,
  //                   "type": 2,
  //                   "instruction": "Turn sharp left onto Handschuhsheimer Landstraße, B 3",
  //                   "name": "Handschuhsheimer Landstraße, B 3",
  //                   "way_points": [22, 24]
  //                 },
  //                 {
  //                   "distance": 130.6,
  //                   "duration": 31.4,
  //                   "type": 0,
  //                   "instruction": "Turn left onto Roonstraße",
  //                   "name": "Roonstraße",
  //                   "way_points": [24, 25]
  //                 },
  //                 {
  //                   "distance": 0,
  //                   "duration": 0,
  //                   "type": 10,
  //                   "instruction": "Arrive at Roonstraße, straight ahead",
  //                   "name": "-",
  //                   "way_points": [25, 25]
  //                 }
  //               ]
  //             }
  //           ],
  //           "way_points": [0, 25],
  //           "summary": {
  //             "distance": 1408.8,
  //             "duration": 281.9
  //           }
  //         },
  //         "geometry": {
  //           "coordinates": [
  //             [8.681495, 49.414599],
  //             [8.68147, 49.414599],
  //             [8.681488, 49.41465],
  //             [8.681423, 49.415746],
  //             [8.681656, 49.41659],
  //             [8.681826, 49.417081],
  //             [8.681881, 49.417392],
  //             [8.682461, 49.417389],
  //             [8.682676, 49.417387],
  //             [8.682781, 49.417386],
  //             [8.683023, 49.417384],
  //             [8.683595, 49.417372],
  //             [8.68536, 49.417365],
  //             [8.686407, 49.417365],
  //             [8.68703, 49.41736],
  //             [8.687467, 49.417351],
  //             [8.688212, 49.417358],
  //             [8.688802, 49.417381],
  //             [8.68871, 49.418194],
  //             [8.688647, 49.418465],
  //             [8.688539, 49.418964],
  //             [8.688398, 49.41963],
  //             [8.690123, 49.419833],
  //             [8.689854, 49.420217],
  //             [8.689653, 49.420514],
  //             [8.687871, 49.420322]
  //           ],
  //           "type": "LineString"
  //         }
  //       }
  //     ],
  //     "metadata": {
  //       "attribution": "openrouteservice.org | OpenStreetMap contributors",
  //       "service": "routing",
  //       "timestamp": 1735143373340,
  //       "query": {
  //         "coordinates": [
  //           [8.681495, 49.41461],
  //           [8.687872, 49.420318]
  //         ],
  //         "profile": "driving-car",
  //         "profileName": "driving-car",
  //         "format": "json"
  //       },
  //       "engine": {
  //         "version": "9.0.0",
  //         "build_date": "2024-12-02T11:09:21Z",
  //         "graph_date": "2024-12-12T05:07:37Z"
  //       }
  //     }
  //   }
};



//Calculates the driving route between two points.
//Returns a route between two or more locations for a selected profile and its settings as JSON


export const directionsServiseJson = async (
  originLongitude,
  originLatitude,
  destinationLongitude,
  destinationLatitude
) => {
  try {

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [
          [originLongitude, originLatitude],
          [destinationLongitude, destinationLatitude],
        ],
        continue_straight: true, 
        geometry_simplify: true, 
        units: "km", 
      },
      {
        headers: {
          Accept: "application/json, application/geo+json; charset=utf-8",
          Authorization: OpenRouteServiceApiKey, 
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    
    const data = response.data;
    return data;
  } catch (error) {
    
    console.error("Error in directionServise:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    
  }

  // sample output

  //originLongitude:8.681495,
  //originLatitude:49.41461
  //destinationLongitude:8.690123
  //destinationLatitude:49.420514


  // {
  //   "bbox": [8.681423, 49.414599, 8.690123, 49.420514],
  //   "routes": [
  //     {
  //       "summary": { "distance": 1.409, "duration": 281.9 },
  //       "segments": [
  //         {
  //           "distance": 1.409,
  //           "duration": 281.9,
  //           "steps": [
  //             {
  //               "distance": 0.002,
  //               "duration": 0.4,
  //               "type": 11,
  //               "instruction": "Head west on Gerhart-Hauptmann-Straße",
  //               "name": "Gerhart-Hauptmann-Straße",
  //               "way_points": [0, 1]
  //             },
  //             {
  //               "distance": 0.314,
  //               "duration": 75.3,
  //               "type": 1,
  //               "instruction": "Turn right onto Wielandtstraße",
  //               "name": "Wielandtstraße",
  //               "way_points": [1, 6]
  //             },
  //             {
  //               "distance": 0.501,
  //               "duration": 76.4,
  //               "type": 1,
  //               "instruction": "Turn right onto Mönchhofstraße",
  //               "name": "Mönchhofstraße",
  //               "way_points": [6, 9]
  //             },
  //             {
  //               "distance": 0.252,
  //               "duration": 60.5,
  //               "type": 0,
  //               "instruction": "Turn left onto Erwin-Rohde-Straße",
  //               "name": "Erwin-Rohde-Straße",
  //               "way_points": [9, 11]
  //             },
  //             {
  //               "distance": 0.127,
  //               "duration": 30.4,
  //               "type": 1,
  //               "instruction": "Turn right onto Moltkestraße",
  //               "name": "Moltkestraße",
  //               "way_points": [11, 12]
  //             },
  //             {
  //               "distance": 0.083,
  //               "duration": 7.5,
  //               "type": 2,
  //               "instruction": "Turn sharp left onto Handschuhsheimer Landstraße, B 3",
  //               "name": "Handschuhsheimer Landstraße, B 3",
  //               "way_points": [12, 13]
  //             },
  //             {
  //               "distance": 0.131,
  //               "duration": 31.4,
  //               "type": 0,
  //               "instruction": "Turn left onto Roonstraße",
  //               "name": "Roonstraße",
  //               "way_points": [13, 14]
  //             },
  //             {
  //               "distance": 0,
  //               "duration": 0,
  //               "type": 10,
  //               "instruction": "Arrive at Roonstraße, straight ahead",
  //               "name": "-",
  //               "way_points": [14, 14]
  //             }
  //           ]
  //         }
  //       ],
  //       "bbox": [8.681423, 49.414599, 8.690123, 49.420514],
  //       "geometry": "ghrlHir~s@?BIC{ELgDo@aBa@}@IF}a@AsCCuBaDP_H|@g@wIgC|Ad@bJ",
  //       "way_points": [0, 14]
  //     }
  //   ],
  //   "metadata": {
  //     "attribution": "openrouteservice.org | OpenStreetMap contributors",
  //     "service": "routing",
  //     "timestamp": 1735233186614,
  //     "query": {
  //       "coordinates": [
  //         [8.681495, 49.41461],
  //         [8.687872, 49.420318]
  //       ],
  //       "profile": "driving-car",
  //       "profileName": "driving-car",
  //       "format": "json",
  //       "units": "km",
  //       "continue_straight": true,
  //       "geometry_simplify": true
  //     },
  //     "engine": {
  //       "version": "9.0.0",
  //       "build_date": "2024-12-02T11:09:21Z",
  //       "graph_date": "2024-12-12T05:07:37Z"
  //     }
  //   }
  // }
  





};









//Calculates distances and durations between multiple points.
//Returns duration or distance matrix for multiple source and destination points.
//By default a square duration matrix is returned where every point in locations is paired with each other.
//The result is null if a value can’t be determined.


export const matrixService = async (locations) => {
  try {
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/matrix/driving-car`,
      {
        locations: locations,
        destinations: [0],
        metrics: ["duration", "distance"],
        units: "km",
      },
      {
        headers: {
          Accept: "application/json, application/geo+json; charset=utf-8",
          Authorization: OpenRouteServiceApiKey,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    const data = response.data;

    // const sortedData = data.distances[0]
    //   .map((distance, index) => ({
    //     index,
    //     distance,
    //     source: data.sources[index].location,
    //   }))
    //   .sort((a, b) => a.distance - b.distance);

    return data;
  } catch (error) {
    console.error("Error in calculateDrivingMatrix:", error);
    
  }

  // sample data

  //locations = [[longitude1,latitude1], [longitude2,latitude2], ...];
  //locations = [[9.70093,48.477473],[9.207916,49.153868],[37.573242,55.801281],[115.663757,38.106467]];

  //sample output

  // {
  //     "durations": [
  //       [0], = [location1-location1]
  //       [5540.67], = [location1-location2]
  //       [92467.98], = [location1-location3]
  //       [395614.28] =[location1-location4]
  //     ],
  //     "distances": [
  //       [0],  = [location1-location1]
  //       [139.75], = [location1-location2]
  //       [2385.93], = [location1-location3]
  //       [9814.54] =[location1-location4]
  //     ],
  //     "destinations": [
  //       {
  //         "location": [9.700817, 48.476406],
  //         "snapped_distance": 118.9
  //       }
  //     ],
  //     "sources": [
  //       {
  //         "location": [9.700817, 48.476406],
  //         "snapped_distance": 118.9
  //       },
  //       {
  //         "location": [9.207773, 49.153882],
  //         "snapped_distance": 10.54
  //       },
  //       {
  //         "location": [37.572963, 55.801279],
  //         "snapped_distance": 17.44
  //       },
  //       {
  //         "location": [115.665017, 38.100717],
  //         "snapped_distance": 648.79
  //       }
  //     ],
  //     "metadata": {
  //       "attribution": "openrouteservice.org | OpenStreetMap contributors",
  //       "service": "matrix",
  //       "timestamp": 1735147798981,
  //       "query": {
  //         "locations": [
  //           [9.70093, 48.477473],
  //           [9.207916, 49.153868],
  //           [37.573242, 55.801281],
  //           [115.663757, 38.106467]
  //         ],
  //         "profile": "driving-car",
  //         "profileName": "driving-car",
  //         "responseType": "json",
  //         "destinations": [
  //           "0"
  //         ],
  //         "metrics": [
  //           "duration",
  //           "distance"
  //         ],
  //         "units": "km"
  //       },
  //       "engine": {
  //         "version": "9.0.0",
  //         "build_date": "2024-12-02T11:09:21Z",
  //         "graph_date": "2024-12-12T05:07:37Z"
  //       }
  //     }
  //   }
};

// Converts an address into coordinates.
//Returns a JSON formatted list of objects corresponding to the search input.

export const forwardGeocodeService = async (address) => {
  try {
    // const response = await axios.get(
    //   `https://api.openrouteservice.org/geocode/search?api_key=${OpenRouteServiceApiKey}&text=${encodeURIComponent(
    //     address
    //   )}&boundary.country=BE`
    // );

    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: OpenRouteServiceApiKey,
          text: address,
          "boundary.country": "BE",
          "boundary.rect.min_lon": 4.25,
          "boundary.rect.min_lat": 50.77,
          "boundary.rect.max_lon": 4.42,
          "boundary.rect.max_lat": 50.92,
          // size: 5,
        },
        headers: {
          Accept: "application/json, application/geo+json; charset=utf-8",
        },
      }
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error in forwardGeocodeService:", error.message);
    
  }

  // sample data
  // coordinates = response.data.features.map((feature) => feature.geometry.coordinates;

  //adress = ehb, response = 3

  //   {
  //     "geocoding": {
  //       "version": "0.2",
  //       "attribution": "https://openrouteservice.org/terms-of-service/#attribution-geocode",
  //       "query": {
  //         "text": "ehb",
  //         "size": 10,
  //         "layers": [
  //           "venue",
  //           "street",
  //           "country",
  //           "macroregion",
  //           "region",
  //           "county",
  //           "localadmin",
  //           "locality",
  //           "borough",
  //           "neighbourhood",
  //           "continent",
  //           "empire",
  //           "dependency",
  //           "macrocounty",
  //           "macrohood",
  //           "microhood",
  //           "disputed",
  //           "postalcode",
  //           "ocean",
  //           "marinearea"
  //         ],
  //         "private": false,
  //         "boundary.country": [
  //           "BEL"
  //         ],
  //         "lang": {
  //           "name": "English",
  //           "iso6391": "en",
  //           "iso6393": "eng",
  //           "via": "header",
  //           "defaulted": false
  //         },
  //         "querySize": 20,
  //         "parser": "pelias",
  //         "parsed_text": {
  //           "subject": "ehb"
  //         }
  //       },
  //       "warnings": [
  //         "performance optimization: excluding 'address' layer"
  //       ],
  //       "engine": {
  //         "name": "Pelias",
  //         "author": "Mapzen",
  //         "version": "1.0"
  //       },
  //       "timestamp": 1735151675081
  //     },
  //     "type": "FeatureCollection",
  //     "features": [
  //       {
  //         "type": "Feature",
  //         "geometry": {
  //           "type": "Point",
  //           "coordinates": [3.053029, 50.942181] ---- coordinates -----
  //         },
  //         "properties": {
  //           "id": "way/114469471",
  //           "gid": "openstreetmap:venue:way/114469471",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "way/114469471",
  //           "name": "EHBH",
  //           "housenumber": "20",
  //           "street": "Westrozebekestraat",
  //           "confidence": 1,
  //           "match_type": "exact",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "West-Vlaanderen",
  //           "region_gid": "whosonfirst:region:85681709",
  //           "region_a": "WV",
  //           "county": "Roeselare",
  //           "county_gid": "whosonfirst:county:102049977",
  //           "county_a": "RS",
  //           "localadmin": "Staden",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830315",
  //           "locality": "Oostnieuwkerke",
  //           "locality_gid": "whosonfirst:locality:101809301",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "EHBH, Oostnieuwkerke, WV, Belgium"
  //         },
  //         "bbox": [3.0529468, 50.9421124, 3.0531116, 50.9422499]
  //       },
  //       {
  //         "type": "Feature",
  //         "geometry": {
  //           "type": "Point",
  //           "coordinates": [2.599841, 51.080838] ---- coordinates -----
  //         },
  //         "properties": {
  //           "id": "node/4660389763",
  //           "gid": "openstreetmap:venue:node/4660389763",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "node/4660389763",
  //           "name": "EHBO",
  //           "confidence": 1,
  //           "match_type": "exact",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "West-Vlaanderen",
  //           "region_gid": "whosonfirst:region:85681709",
  //           "region_a": "WV",
  //           "county": "Veurne",
  //           "county_gid": "whosonfirst:county:102049991",
  //           "county_a": "VR",
  //           "localadmin": "De Panne",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830697",
  //           "locality": "Adinkerke",
  //           "locality_gid": "whosonfirst:locality:101809385",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "EHBO, Adinkerke, WV, Belgium",
  //           "addendum": {
  //             "osm": {
  //               "wheelchair": "yes"
  //             }
  //           }
  //         }
  //       },
  //       {
  //         "type": "Feature",
  //         "geometry": {
  //           "type": "Point",
  //           "coordinates": [4.713431, 51.08269] ---- coordinates -----
  //         },
  //         "properties": {
  //           "id": "node/6804163793",
  //           "gid": "openstreetmap:venue:node/6804163793",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "node/6804163793",
  //           "name": "Brandweer & EHBO-shop",
  //           "confidence": 1,
  //           "match_type": "exact",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "Antwerpen",
  //           "region_gid": "whosonfirst:region:85681715",
  //           "region_a": "AN",
  //           "county": "Mechelen",
  //           "county_gid": "whosonfirst:county:102049985",
  //           "county_a": "MH",
  //           "localadmin": "Heist-op-den-Berg",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830023",
  //           "locality": "Heist-op-den-Berg",
  //           "locality_gid": "whosonfirst:locality:101755661",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "Brandweer & EHBO-shop, Heist-op-den-Berg, AN, Belgium",
  //           "addendum": {
  //             "osm": {
  //               "website": "https://www.brandweershop.be"
  //             }
  //           }
  //         }
  //       }
  //     ],
  //     "bbox": [2.599841, 50.9421124, 4.713431, 51.08269]
  //   }
};

// Converts an address into coordinates.
//Returns a JSON formatted list of objects corresponding to the search input.

export const geocodeAutocompleteService = async (address) => {
  try {
    //   const response = await axios.get(
    //     `https://api.openrouteservice.org/geocode/search?api_key=${OpenRouteServiceApiKey}&text=${encodeURIComponent(
    //       address
    //     )}&boundary.country=BE`
    //   );

    const response = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: OpenRouteServiceApiKey,
          text: address,
          "boundary.country": "BE",
          "boundary.rect.min_lon": 4.25,
          "boundary.rect.min_lat": 50.77,
          "boundary.rect.max_lon": 4.42,
          "boundary.rect.max_lat": 50.92,
          // size: 5,
        },
        headers: {
          Accept: "application/json, application/geo+json; charset=utf-8",
        },
      }
    );

    const data = response.data;


    

    return data;
  } catch (error) {
    console.error("Error in geocodeAutocompleteService:", error.message);
    
  }

  // sample data
  // coordinates = response.data.features.map((feature) => feature.geometry.coordinates);
  //adress = ehb, response = 3

  //   {
  //     "geocoding": {
  //       "version": "0.2",
  //       "attribution": "https://openrouteservice.org/terms-of-service/#attribution-geocode",
  //       "query": {
  //         "text": "ehb",
  //         "parser": "pelias",
  //         "parsed_text": { "subject": "ehb" },
  //         "size": 10,
  //         "layers": [
  //           "venue",
  //           "street",
  //           "country",
  //           "macroregion",
  //           "region",
  //           "county",
  //           "localadmin",
  //           "locality",
  //           "borough",
  //           "neighbourhood",
  //           "continent",
  //           "empire",
  //           "dependency",
  //           "macrocounty",
  //           "macrohood",
  //           "microhood",
  //           "disputed",
  //           "postalcode",
  //           "ocean",
  //           "marinearea"
  //         ],
  //         "private": false,
  //         "boundary.country": ["BEL"],
  //         "lang": {
  //           "name": "English",
  //           "iso6391": "en",
  //           "iso6393": "eng",
  //           "via": "header",
  //           "defaulted": false
  //         },
  //         "querySize": 20
  //       },
  //       "warnings": ["performance optimization: excluding 'address' layer"],
  //       "engine": { "name": "Pelias", "author": "Mapzen", "version": "1.0" },
  //       "timestamp": 1735154321906
  //     },
  //     "type": "FeatureCollection",
  //     "features": [
  //       {
  //         "type": "Feature",
  //         "geometry": { "type": "Point", "coordinates": [4.713431, 51.08269] },
  //         "properties": {
  //           "id": "node/6804163793",
  //           "gid": "openstreetmap:venue:node/6804163793",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "node/6804163793",
  //           "name": "Brandweer & EHBO-shop",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "Antwerpen",
  //           "region_gid": "whosonfirst:region:85681715",
  //           "region_a": "AN",
  //           "county": "Mechelen",
  //           "county_gid": "whosonfirst:county:102049985",
  //           "county_a": "MH",
  //           "localadmin": "Heist-op-den-Berg",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830023",
  //           "locality": "Heist-op-den-Berg",
  //           "locality_gid": "whosonfirst:locality:101755661",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "Brandweer & EHBO-shop, Heist-op-den-Berg, AN, Belgium",
  //           "addendum": { "osm": { "website": "https://www.brandweershop.be" } }
  //         }
  //       },
  //       {
  //         "type": "Feature",
  //         "geometry": { "type": "Point", "coordinates": [3.053029, 50.942181] },
  //         "properties": {
  //           "id": "way/114469471",
  //           "gid": "openstreetmap:venue:way/114469471",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "way/114469471",
  //           "name": "EHBH",
  //           "housenumber": "20",
  //           "street": "Westrozebekestraat",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "West-Vlaanderen",
  //           "region_gid": "whosonfirst:region:85681709",
  //           "region_a": "WV",
  //           "county": "Roeselare",
  //           "county_gid": "whosonfirst:county:102049977",
  //           "county_a": "RS",
  //           "localadmin": "Staden",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830315",
  //           "locality": "Oostnieuwkerke",
  //           "locality_gid": "whosonfirst:locality:101809301",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "EHBH, Oostnieuwkerke, WV, Belgium"
  //         },
  //         "bbox": [3.0529468, 50.9421124, 3.0531116, 50.9422499]
  //       },
  //       {
  //         "type": "Feature",
  //         "geometry": { "type": "Point", "coordinates": [2.599841, 51.080838] },
  //         "properties": {
  //           "id": "node/4660389763",
  //           "gid": "openstreetmap:venue:node/4660389763",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "node/4660389763",
  //           "name": "EHBO",
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "macroregion": "Flemish Region",
  //           "macroregion_gid": "whosonfirst:macroregion:404227357",
  //           "region": "West-Vlaanderen",
  //           "region_gid": "whosonfirst:region:85681709",
  //           "region_a": "WV",
  //           "county": "Veurne",
  //           "county_gid": "whosonfirst:county:102049991",
  //           "county_a": "VR",
  //           "localadmin": "De Panne",
  //           "localadmin_gid": "whosonfirst:localadmin:1108830697",
  //           "locality": "Adinkerke",
  //           "locality_gid": "whosonfirst:locality:101809385",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "EHBO, Adinkerke, WV, Belgium",
  //           "addendum": { "osm": { "wheelchair": "yes" } }
  //         }
  //       }
  //     ],
  //     "bbox": [2.599841, 50.9421124, 4.713431, 51.08269]
  //   }
};

//Converts geographic coordinates into a human-readable address.
//Returns the next enclosing object with an address tag which surrounds the given coordinate.

export const reverseGeocodeService = async (longitude, latitude) => {
  try {
    const response = await axios.get(
      `https://api.openrouteservice.org/geocode/reverse`,
      {
        params: {
          api_key: OpenRouteServiceApiKey,
          "point.lon": longitude,
          "point.lat": latitude,
          size: 1,
          "boundary.country": "BE",
        },
        headers: {
          Accept: "application/json, application/geo+json; charset=utf-8",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in reverseGeocodeService:", error.message);
    
  }

  // sample data
  // point.lon: 4.288412523860888
  // point.lat: 50.815953690921766

  // {
  //     "geocoding": {
  //       "version": "0.2",
  //       "attribution": "https://openrouteservice.org/terms-of-service/#attribution-geocode",
  //       "query": {
  //         "size": 1,
  //         "private": false,
  //         "point.lat": 50.815953690921766,
  //         "point.lon": 4.288412523860888,
  //         "boundary.circle.lat": 50.815953690921766,
  //         "boundary.circle.lon": 4.288412523860888,
  //         "boundary.country": ["BEL"],
  //         "lang": {
  //           "name": "English",
  //           "iso6391": "en",
  //           "iso6393": "eng",
  //           "via": "header",
  //           "defaulted": false
  //         },
  //         "querySize": 2
  //       },
  //       "engine": { "name": "Pelias", "author": "Mapzen", "version": "1.0" },
  //       "timestamp": 1735155147294
  //     },
  //     "type": "FeatureCollection",
  //     "features": [
  //       {
  //         "type": "Feature",
  //         "geometry": { "type": "Point", "coordinates": [4.28859, 50.815957] },
  //         "properties": {
  //           "id": "node/4659808072",
  //           "gid": "openstreetmap:venue:node/4659808072",
  //           "layer": "venue",
  //           "source": "openstreetmap",
  //           "source_id": "node/4659808072",
  //           "name": "Parking CERIA", -------------- adress-------------
  //           "confidence": 0.8,
  //           "distance": 0.012,
  //           "accuracy": "point",
  //           "country": "Belgium",
  //           "country_gid": "whosonfirst:country:85632997",
  //           "country_a": "BEL",
  //           "region": "Brussels",
  //           "region_gid": "whosonfirst:region:85681713",
  //           "region_a": "BU",
  //           "neighbourhood": "La Roue",
  //           "neighbourhood_gid": "whosonfirst:neighbourhood:85801261",
  //           "continent": "Europe",
  //           "continent_gid": "whosonfirst:continent:102191581",
  //           "label": "Parking CERIA, BU, Belgium",
  //           "addendum": { "osm": { "wheelchair": "yes" } }
  //         }
  //       }
  //     ],
  //     "bbox": [4.28859, 50.815957, 4.28859, 50.815957]
  //   }
};
