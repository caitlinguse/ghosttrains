/*******************************************************
 * Created by Jennifer Chiang, Caitlin Guse, and Thomas Willington
 * April 2016
 * 
 * GGR400 - Web Mapping 
 * University of Toronto - St. George Campus 
 * Presented to Michael Widener
 *******************************************************/

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FpdGxpbmd1c2UiLCJhIjoiY2lqbm4zZTNuMDBvM3VmbTVjM2M3eWxkayJ9.FodgOirhTvC5b_-woC5MTg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/caitlinguse/cildvdt1e00969nkiutencff7',
  center: [-77.94, 45.28],
  zoom: 7.0
});

map.addControl(new mapboxgl.Navigation());

var popup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false
});

var periodLabel = document.getElementById('labels');
var periodIndex = 0;

var periods = [
    'Early Days: 1860-1899',
    'Railyway Heydays: 1900-1923',
    'Later Days, Decline  & Legacy: 1945 to Present'
];
periodLabel.textContent = periods[periodIndex];

// Fly to
var isAtStart = true;
var isAtEnd = false;
var coord_index = 0;
var target = null;
var coords = [[-80.09976267814636, 45.31653175997123],
              [-78.59338474277791, 45.55198567055761],
              [-77.41567746687218, 45.55398795949882],
              [-76.35812419795509, 45.43316600697178],
              [-76.70825958251953, 45.469280615977105], 
              [-77.44789, 45.382903]];


function fly() {
  // depending on whether we're currently at point a or b, aim for
  // point a or b

  if(isAtStart === true){
    target = coords[0];
    coord_index++;
    isAtStart = false;
  }
  else{
    target = coords[coord_index];
    if (coord_index < coords.length-1){
      coord_index++;
    }
    else if (coord_index == coords.length-1){
        isAtEnd = true;
    }
  }
    if (isAtEnd === false) {
        map.flyTo({
            center: target,
            zoom: 14,
            bearing: 0,
            speed: 0.7, 
            curve: 1, 
            easing: function (t) {
                return t;
            }
        });
    }
    
    // Last click will zoom back out to full view of tracks
    else {
        map.flyTo({
            center: target,
            zoom: 7.46,
            bearing: 0,
            speed: 0.7, 
            curve: 1, 
            easing: function (t) {
                return t;
            }
        });
    }
};

map.on('style.load', function() {
    
    map.addSource('stations', {
            'type': 'vector',
            'url': 'mapbox://caitlinguse.8fecs4bb'
        });
    
    map.addLayer({
      "id": "railwaystations",
      "type": "circle",
      "source": "stations",
      "layout": {},
      "paint":{
          'circle-color': "#a50f15",
          'circle-radius': 4,
          'circle-opacity': 0.7,
      },
    "source-layer": "Stations"
      
  });
    
    // Major popups for each fly to location
    map.addSource('popupsFlyTo', {
            'type': 'geojson',
            'data': 'data/popups.flyto.geojson'
        });
    map.addLayer({
      "id": "popupFlyToLayer",
      "type": "circle",
      "source": "popupsFlyTo",
      "layout": {},
      "interactive": true,
      "paint":{
        'circle-color': "#fb6a4a",
        'circle-radius': 10,
        'circle-opacity': 1
      }
      
  });
  
    // More detailed popups of the towns 
    map.addSource('popups', {
            'type': 'geojson',
            'data': 'data/popups.ghost.geojson'
        });
    map.addLayer({
      "id": "popupLayer",
      "type": "circle",
      "source": "popups",
      "layout": {},
      "interactive": true,
      "paint":{
        'circle-color': "#fee5d9",
        'circle-radius': 10,
        'circle-opacity': 0.6
      }
      
  });
  
    
  // Initial welcome popup
    swal({   title: "<span style=color:#F8BB86>" + "Ottawa, Arnprior, and Parry Sound Railway" + "<span>",   text: " “It was the shortest grain route to the Atlantic through the wilds of central Ontario, its trains arriving and departing every twenty minutes. It was the longest railway ever build and owned by one man in Canada. It was the Ottawa Arnprior and Parry Sound Railway. Today it is a trail of ghost towns.” " + "</br></br>" + "Take a tour through the rise, heyday and decline of the major towns and locations along it's route via the 'Fly To' feature along the now abandoned tracks. Watch out for digitized historic fire insurance maps which detail the ghost towns that were once bustling with commerce and life. While at a location, adjust the Time Period slider to view information for each period." + "</br></br>" + "Further, explore the tracks yourself to find abandoned interactive features including those which detail the life of the OA&PS's iconic figure, JR Booth." + "</br></br>" + "Finally, navigate to <a href='http://www.exporail.org/can_rail/Canadian%20Rail_no156_1964.pdf'> this link </a> for a detailed history of the OA&PS Railroad.",  confirmButtonColor: "#DD6B55", confirmButtonText: "Explore!", html: true });
    
        // Slider - gets the time period as an index (0-2)
        document.getElementById('slider').addEventListener('input', function(e) {
            periodIndex = parseInt(e.target.value, 10);
            periodLabel.textContent = periods[periodIndex];
            popup.remove();
        });
});

var popup = new mapboxgl.Popup({
  closeButton: true,
  closeOnClick: true
});

map.on("click", function(e) {
    map.featuresAt(e.point, {
        radius: 20,
        includeGeometry: true,
        layers: ["popupLayer"]
    }, function (err, features) {
        
        // Loop through the images stored with each point (number of images varies)
        var i = 1;
        var imgname = "ImageURL" + i; // Image URLS in the GeoJSON are all stored in this format
        var string = "";
        
        // The properties of each Feature is an array of 3 elements, each containing info specific to a period. 
        //i.e. 0th element is 1860-1899
        while (features[0].properties[periodIndex][imgname] != null) {
            // Add image information in a string to later set HTML
            string = string + "<img src='" + features[0].properties[periodIndex][imgname] + "' style='width:300px;'</br>";
            i++;
            var imgname = "ImageURL" + i;
        }

        //if there is text and image
        if (!err && features.length && features[0].properties[periodIndex].Title != null && features[0].properties[periodIndex].ImageURL1 != null) { 
          popup.setLngLat(e.lngLat)
              .setHTML(
                "<div class='scroll'><center><h2>" + features[0].properties[periodIndex].Title + "</h2> <p>" + features[0].properties[periodIndex].Information + "</p>" + 
              string + "</center></div>"
              )
              .addTo(map);
        }

        else {
            popup.remove();
            return;
        }
    });
    
});

// Same info for the fly-to popups 
map.on("click", function(e) {
    map.featuresAt(e.point, {
        radius: 30,
        includeGeometry: true,
        layers: ["popupFlyToLayer"]
    }, function (err, features) {
        var i = 1;
        var imgname = "ImageURL" + i; 
        var string = "";
        
        while (features[0].properties[periodIndex][imgname] != null) {
            string = string + "</br><img src='" + features[0].properties[periodIndex][imgname] + "' style='width:300px;'</br>";
            i++;
            var imgname = "ImageURL" + i;
        }

        if (!err && features.length && features[0].properties[periodIndex].Title != null && features[0].properties[periodIndex].ImageURL1 != null) { 
          popup.setLngLat(e.lngLat)
              .setHTML("<div class='scroll'><center><h2>" + features[0].properties[periodIndex].Title + "</h2> <p>" + features[0].properties[periodIndex].Information + "</p>" + 
              string + "</center></div>"
              )
              .addTo(map);
        }

        else {
            popup.remove();
            return;
        }
    });
    
});
