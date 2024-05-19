// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Creating the map object
let myMap = L.map("map", {
  center: [58.5888, -154.4931],
  zoom: 5
});  

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function markerSize(magnitude) {
  return Number(Math.sqrt(magnitude)*20000)
}

// function markerColor(depth) {
//   return Number(Math.sqrt(depth)*40000)
// }

function legendColor(depth) {
  return depth > 90 ? "#080000" :
         depth > 80 ? "#d7191c" :
         depth > 70 ? "#ff7070" :
         depth > 60 ? "#f29e2e" :
         depth > 50 ? "#f9d057" :
         depth > 40 ? "#ffff8c" :
         depth > 30 ? "#90eb9d" :
         depth > 20 ? "#00ccbc" :
         depth > 10 ? "#00a6ca" :
                      "#2c7bb6";
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
          fillOpacity: 0.75,
          //apply function to set legend color palette
          fillColor: legendColor(depth),
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

  // Set up the legend
  //define legend bins
  limits = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  //position the legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    //set legend lines
    for (let i = 0; i < limits.length; i++) {
      div.innerHTML += "<i style='background: " + legendColor(limits[i] + 1) + "'></i> " +
       limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
}