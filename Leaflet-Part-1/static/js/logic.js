d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
    //Get the earthquake data
  spotify(data.features);
});


// Function for all the marker and legend colors by Depth
function markerColor(depth) {
  if (depth <= 0) {
      return "purple"
  } else if (depth <= 10) {
      return "blueviolet"
    } else if (depth <= 20) {
      return "blue "
    } else if (depth <= 30) {
      return "aquamarine"
    } else if (depth <= 40) {
      return "green"
    } else if (depth <= 50) {
      return "greenyellow"
    } else if (depth <= 60) {
      return "yellow"
  } else if (depth <= 70) {
      return "gold"
  } else if (depth <= 80) {
      return "orange"
  } else if (depth <= 640) {
      return "orangered"
  } else {
      return "magenta"
  }
};

function spotify(shakeAndBake) {

 // For each feature set the popup information 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
    "<h3><h3>Magnitude: " + feature.properties.mag + " Mw"+
    "<h3><h3>Depth: " + feature.geometry.coordinates[2]+ " Km"+ 
    "<h3><h3>Tsunami's Created: " + feature.properties.tsunami +
    "<h3><h3>Date of Quake: " + new Date(feature.properties.time ).toDateString() + "</h3>");
  }

 // Set the marker options
let jelloJigglers = L.geoJSON(shakeAndBake, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: feature.properties.mag * 4,
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: .5,
        opacity: 0.75,
        fillOpacity: 1
    });
},
onEachFeature: onEachFeature
});

// Create the map with the markers
createMap(jelloJigglers);
}
// Function to create the map layers
function createMap(jelloJigglers) {

  // Create the default layer
 let CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});
  // Create alternative layers
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    
});
let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

let OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
let NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});

// Create a baseMaps 
let baseMaps = {
"Dark Matter": CartoDB_DarkMatter,
"Street Map": streetmap,
"Topographical": OpenTopoMap,
"World Map": Esri_WorldImagery,

"NASA at Night": NASAGIBS_ViirsEarthAtNight2012

};

  // Create the overlay maps
  let overlayMaps = {
    "Quake Spots": jelloJigglers,
   
  };

 
  // Create the loading map
  let myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers: [streetmap, jelloJigglers]
  });

  // Create a layer control.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false,
    color: "gray"
  }).addTo(myMap);

// Create the map legend 
  let legend = L.control({ position: "bottomright",
  basesize: 10});
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      depths= [ -10,1,10,20,30,40,50,60,70,80,90];
      labels = [];
      legendInfo = "<h3>Quake Depth <br> In Kilometers <br> Below Sea Level</h3>";
      div.innerHTML = legendInfo;
      
      // Append the information to the empty labels array
      for (let i = 0; i < depths.length; i++) {
          labels.push('<i style="background-color:' + markerColor(depths[i] + 1) + '"></i>' + depths[i] + (depths[i + 1]
               ? ' &ndash; ' + depths[i + 1] +' ' + '<br>' : ' + ')) ;
      }
      // add label items to the div 
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

};