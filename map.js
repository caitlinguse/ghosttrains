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

var periodLabel = document.getElementById('period');

// Will contain the layers we wish to interact with on
// during map mouseover and click events.
var layerIDs = [];

var periods = [
    '1890-1910',
    '1911-1930',
    '1931-1950',
    '1951-1970'
];

function filterBy(period, index) {
    // Clear the popup if displayed.
    popup.remove();

    var filters = [
        "all",
        ["==", "period", period]
    ];

   // map.setFilter('circle-' + index, filters);
    map.setFilter('label-' + index, filters);

    // Set the label to the month
    periodLabel.textContent = periods[period];
}
/*
map.on('style.load', function() {

    // Here we're using d3 to help us make the ajax request but you can use
    // Any request method (library or otherwise) you wish.
    d3.json('/mapbox-gl-js/assets/data/significant-earthquakes-2015.geojson', function(err, data) {

        // Create a month property value based on time
        // used to filter against.
        data.features = data.features.map(function(d) {
            d.properties.month = new Date(d.properties.time).getMonth();
            return d;
        })

        map.addSource('earthquakes', {
            'type': 'geojson',
            'data': data
        });

        // Apply layer styles
        magnitudes.forEach(function(mag, i) {
            var layerID = 'circle-' + i;
            layerIDs.push(layerID);

            map.addLayer({
                "id": layerID,
                "type": "circle",
                "source": "earthquakes",
                "paint": {
                    "circle-color": mag[1],
                    "circle-opacity": 0.75,
                    "circle-radius": (mag[0] - 4) * 10 // Nice radius value
                }
            });

            map.addLayer({
                "id": "label-" + i,
                "type": "symbol",
                "source": "earthquakes",
                "layout": {
                    "text-field": "{mag}m",
                    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                    "text-size": 12
                },
                "paint": {
                    "text-color": "rgba(0,0,0,0.5)"
                }
            });

            // Set filter to first month of the year +
            // Magnitude rating. 0 = January
            filterBy(0, mag, i);

            // Add legend bar
            var bar = document.createElement('div');
            bar.className = 'bar';
            bar.title = mag[0];
            bar.style.width = 100 / magnitudes.length + '%';
            bar.style.backgroundColor = mag[1];
            legend.insertBefore(bar, legend.firstChild);
        });

        document.getElementById('slider').addEventListener('input', function(e) {
            var month = parseInt(e.target.value, 10);
            magnitudes.forEach(function(mag, i) {
                filterBy(month, mag, i);
            });
        });

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
    });
});
*/