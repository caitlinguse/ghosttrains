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
    '1890-1910',
    '1911-1930',
    '1931-1950',
    '1951-1970'
];
periodLabel.textContent = periods[periodIndex];


map.on('style.load', function() {
    
    map.addSource('railway', {
            'type': 'vector',
            'url': 'mapbox://caitlinguse.8fecs4bb'
        });
    
    map.addLayer({
      "id": "railwayline",
      "type": "circle",
      "source": "railway",
      "layout": {},
      "paint":{
          'circle-color': "black",
        'circle-radius': 5
      },
    "source-layer": "Stations"
      
  });
    
    map.addSource('importantpoints', {
            'type': 'geojson',
            'data': 'data/importantpoints.geojson'
        });
    map.addLayer({
      "id": "pointsLayer",
      "type": "circle",
      "source": "importantpoints",
      "layout": {},
      "interactive": true,
      "paint":{
        'circle-color': "black",
        'circle-radius': 5,
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
        radius: 5,
        includeGeometry: true,
        layers: ["pointsLayer"]
    }, function (err, features) {
        //FIRST: We will change the color of the dissemination area we're hovering over

        if (!err && features.length && features[0].properties[periodIndex].Name != null) { //if no error, and features.length is 'true' (meaning there's stuff in there) then do the following
          popup.setLngLat(e.lngLat)
              .setHTML(
                "<center><h2>Name: " + features[0].properties[periodIndex].Name + "</h2>"
              )
              .addTo(map);
        }

        else {
            popup.remove();
            return;
        }
    });
});
