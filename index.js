function init() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJtaWxsYXM3IiwiYSI6ImNrNDh0YTJrbzE1bXIzc3BqMGk2cjh0MW4ifQ.BsJudZIqIKLsc0k1YCPMFg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/armillas7/ck6gp57tl3ke51ikvv1v1kw2t',
        center: [2.83726, 41.97227],
        zoom: 13,
        attributionControl: false,
        pitch: 45,
        hash: true
    });

    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', function () {

        addEstructura();
        //addMobiliari();
        addSepultures();
        addMenu();
        addLegend();

        function addSepultures() {
            map.addSource("sepultures_source", {
                type: "vector",
                url: "mapbox://armillas7.5ayrhllt"
            });

            map.addLayer({
                id: "sepultures-tipus",
                type: "circle",
                source: "sepultures_source",
                'source-layer': "sepultures-54xd48"
            });
        }

            map.addLayer({
                id: "sepultures-any",
                type: "circle",
                source: "sepultures_source",
                'source-layer': "sepultures-54xd48",
                'paint': {
                    'circle-color': {
                        property: 'ANY_CONST',
                        type: 'interval',
                        stops: [
                            [1860, '#e7d01d'],
                            [1890, '#be801e'],
                            [1920, '#e7271d'],
                            [1950, '#1f93c1'],
                            [1980, '#1f4dc1'],
                            [1991, '#781fc1']
                        ]
                    }
                }
            });

        function addMobiliari() {
            map.addSource("mobiliari_source", {
                type: "vector",
                url: "mapbox://armillas7.0zjw01ii" //poner mapbox://vuestro id
            }); //fin map source

            map.addLayer({
                id: "mobiliari",
                type: "circle",
                source: "mobiliari_source",
                'source-layer': "mobiliari-bwrsx6" //poner vuestro titulo capa
            });

        }

        function addEstructura() {
            map.addSource("estructura_source", {
                type: "vector",
                url: "mapbox://armillas7.7w4ontwt" //poner mapbox://vuestro id
            }); //fin map source

            map.addLayer({
                id: "estructura",
                type: "fill-extrusion",
                source: "estructura_source",
                'source-layer': "estructura-8w4ydg",
                "paint": {
                    "fill-extrusion-height": 10,
                    "fill-extrusion-color": "#0B615E"
                }
            });

        }

        function addMenu() {
            $("#sepu-any").click(function() {
                map.setLayoutProperty("sepultures-any", 'visibility', 'visible');
                map.setLayoutProperty("sepultures-tipus", 'visibility', 'none');
                $("#sepu-any").addClass("active");
                $("#sepu-tipus").removeClass("active");
                $("#sepu-any-legend").show();
                $("#sepu-tipus-legend").hide();
            });

            $("#sepu-tipus").click(function() {
                map.setLayoutProperty("sepultures-tipus", 'visibility', 'visible');
                map.setLayoutProperty("sepultures-any", 'visibility', 'none');
                $("#sepu-tipus").addClass("active");
                $("#sepu-any").removeClass("active");
                $("#sepu-tipus-legend").show();
                $("#sepu-any-legend").hide();
            });
        }

        function addLegend(){

        }
    });

    map.on('click', 'sepultures-any', function (e) {
        addPopup(e);
    });

    map.on('click', 'sepultures-tipus', function (e) {
        addPopup(e);
    });

    function addPopup(e) {
        var sepYear = e.features[0].properties["ANY_CONST"];
        var sepLocator = e.features[0].properties["LOCALITZAD"];
        var sepConstName = e.features[0].properties["NOMCONST"].toLowerCase();;
        var sepDpt = e.features[0].properties["NOMDPT"].toLowerCase();;
        var sepLayer = e.features[0].properties["LAYER"];

        var popupTxt = '';

        popupTxt +=
            '<div class="popup">' +
            '<div class="detail">' +
            '<span class="title">Any: </span>' +
            '<span class="detail-txt">' + sepYear + '</span>' +
            '</div>' +
            '<div class="detail">' +
            '<span class="title">Tipus: </span>' +
            '<span class="detail-txt">' + sepConstName + '</span>' +
            '</div>' +
            '<div class="detail">' +
            '<span class="title">Departament: </span>' +
            '<span class="detail-txt">' + sepDpt + '</span>' +
            '</div>' +
            '<div class="detail">' +
            '<span class="title">Localitazador: </span>' +
            '<span class="detail-txt">' + sepLocator + '</span>' +
            '</div>' +
            '<div class="detail">' +
            '<span class="title">Capa font: </span>' +
            '<span class="detail-txt">' + sepLayer + '</span>' +
            '</div>' +
            '</div>'
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupTxt)
            .addTo(map);
    }

    map.on('mouseenter', 'sepultures-any', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseenter', 'sepultures-tipus', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'sepultures-any', function () {
        map.getCanvas().style.cursor = '';
    });

    map.on('mouseleave', 'sepultures-tipus', function () {
        map.getCanvas().style.cursor = '';
    });
}