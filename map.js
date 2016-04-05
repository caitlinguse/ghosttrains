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

//fly to
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

function referencesPopUp () {
    swal({   title: "<span style=color:#F8BB86>" + "Ottawa, Arnprior, and Parry Sound Railway" + "<span>",   text: "The Ottawa, Arnprior, and Parry Sound Railway connected Ontario cities from 1897 to 1959. While its presence permitted the growth of these cities for a period of time, its discontinued use also encouraged some to decline in more recent years." + "</br></br>" + "To explore the impacts of the railway throughout history, click 'Fly To' to be brought to different locations along the now abandoned tracks. At some locations, you will be able to view maps from that time period over the modern basemap. While at a location, adjust the Time Period slider to view information for each period.",  confirmButtonColor: "#DD6B55", confirmButtonText: "Explore!", html: true });
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
          'circle-color': "black",
        'circle-radius': 5
      },
    "source-layer": "Stations"
      
  });
    
    map.addSource('popupsFlyTo', {
            'type': 'geojson',
            'data': 'popups.geojson'
        });
    map.addLayer({
      "id": "popupFlyToLayer",
      "type": "circle",
      "source": "popupsFlyTo",
      "layout": {},
      "interactive": true,
      "paint":{
        'circle-color': "blue",
        'circle-radius': 10,
        'circle-opacity': 1
      }
      
  });
  
  map.addSource('popups', {
            'type': 'geojson',
            'data': 'popups.ghost.geojson'
        });
    map.addLayer({
      "id": "popupLayer",
      "type": "circle",
      "source": "popups",
      "layout": {},
      "interactive": true,
      "paint":{
        'circle-color': "green",
        'circle-radius': 10,
        'circle-opacity': 1
      }
      
  });
  
    
  
    swal({   title: "<span style=color:#F8BB86>" + "Ottawa, Arnprior, and Parry Sound Railway" + "<span>",   text: "The Ottawa, Arnprior, and Parry Sound Railway connected Ontario cities from 1897 to 1959. While its presence permitted the growth of these cities for a period of time, its discontinued use also encouraged some to decline in more recent years." + "</br></br>" + "To explore the impacts of the railway throughout history, click 'Fly To' to be brought to different locations along the now abandoned tracks. At some locations, you will be able to view maps from that time period over the modern basemap. While at a location, adjust the Time Period slider to view information for each period.",  confirmButtonColor: "#DD6B55", confirmButtonText: "Explore!", html: true });
    
        // get the time period (0-3)
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
        
        var i = 1;
        var imgname = "ImageURL" + i;
        var string = "";
        while (features[0].properties[periodIndex][imgname] != null) {
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
