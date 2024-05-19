// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log("data.features: ", data.features)
});

// Creating the map object
let myMap = L.map("map", {
  center: [40.863848, -96.674824],
  zoom: 5
});  

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
  return Number(Math.sqrt(magnitude)*50000)
}

function markerColor(depth) {
  return Number(Math.sqrt(depth)*40000)
}

function createFeatures(earthquakeData) {
  let magnitude_array = [];
  // Loop through the earthquakes array, and create one marker for each earthquake object.
  for (let i = 0; i < earthquakeData.length; i++) {
    let earthquake = earthquakeData[i];
    let latitude = earthquake.geometry.coordinates[1];
    let longitude = earthquake.geometry.coordinates[0];
    let depth = earthquake.geometry.coordinates[2];
    let magnitude = Math.abs(earthquake.properties.mag);

    if (!isNaN(magnitude) || !isNaN(depth)) {
      L.circle([latitude,longitude], {
          fillOpacity: 0.35,
          fillColor: markerColor(depth),
          color:"green",
          weight:1,
          radius: markerSize(magnitude)
      }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr>
      <p>Magnitude: ${magnitude}</p>
      <p>Depth: ${depth}</p>  
      <p>${new Date(earthquake.properties.time)}</p>`).addTo(myMap);
    } else {
      console.error("Invalid magnitude or depth:", magnitude,depth);
    }
  }
}