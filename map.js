mapboxgl.accessToken = 'pk.eyJ1IjoiY2FpdGxpbmd1c2UiLCJhIjoiY2lqbm4zZTNuMDBvM3VmbTVjM2M3eWxkayJ9.FodgOirhTvC5b_-woC5MTg';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/caitlinguse/cilx3q3so006e9km8gzv64kxl',
  center: [-79.9, 44.40],
  zoom: 6.0
});

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

        // get the time period (0-3)
        document.getElementById('slider').addEventListener('input', function(e) {
            periodIndex = parseInt(e.target.value, 10);
            periodLabel.textContent = periods[periodIndex];
            popup.remove();
        });
/*
        map.on('mousemove', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: layerIDs });
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
        });

        map.on('click', function(e) {
            var features = map.queryRenderedFeatures(e.point, { layers: layerIDs });
            if (!features.length) {
                popup.remove();
                return;
            }

            var feature = features[0];

            var link = document.createElement('a');
            link.href = feature.properties.url;
            link.target = '_blank';
            link.textContent = feature.properties.place;

            // Use wrapped coordinates to ensure longitude is within (180, -180)
            var coords = feature.geometry.coordinates;
            var ll = new mapboxgl.LngLat(coords[0], coords[1]);
            var wrapped = ll.wrap();

            // Center the map to its point.
            map.flyTo({ center: wrapped });
            popup.setLngLat(wrapped)
                .setHTML(link.outerHTML)
                .addTo(map);
        });
    
    */
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