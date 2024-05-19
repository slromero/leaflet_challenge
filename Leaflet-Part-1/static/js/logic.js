// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    // console.log("data.features: ", data.features)
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

  // Set up the legend.
  limits = [];
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let colors = ["#2c7bb6","#00a6ca","#00ccbc","#90eb9d","#ffff8c","#f9d057","#f29e2e","#e76818","#d7191c"]
    let labels = [];

    // Add the minimum and maximum.
    let legendInfo = "<h2>Earthquake Depth</h2>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + Math.min(limits) + "</div>" +
        "<div class=\"max\">" + Math.max(limits) + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
}