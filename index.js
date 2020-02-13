/*
    David Armillas Camins
    Febrer del 2020
    Màster SIG
*/

function init() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJtaWxsYXM3IiwiYSI6ImNrNDh0YTJrbzE1bXIzc3BqMGk2cjh0MW4ifQ.BsJudZIqIKLsc0k1YCPMFg';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/armillas7/ck6gp57tl3ke51ikvv1v1kw2t',
        center: [2.83726, 41.97227],
        zoom: 17,
        attributionControl: false,
        pitch: 45,
        hash: true
    });

    map.addControl(new mapboxgl.GeolocateControl());
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', function () {
        addEstructura();
        addMobiliari();
        addSepultures();
        map.setLayoutProperty("sepultures-tipus", 'visibility', 'none');

        function addSepultures() {
            map.addSource("sepultures_source", {
                type: "vector",
                url: "mapbox://armillas7.5ayrhllt"
            });

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

            map.addLayer({
                id: "sepultures-tipus",
                type: "circle",
                source: "sepultures_source",
                'source-layer': "sepultures-54xd48",
                'paint': {
                    'circle-color': [
                        "match",
                            ['get', 'NOMCONST'],
                            'ALTAR',
                            '#EBC414',
                            'COLUMBARI',
                            '#5B463C',
                            'HIPOGEU',
                            '#B4A68F',
                            'NINXOL',
                            '#A16766',
                            'PANTEO',
                            '#9E252A',
                            'TOMBA',
                            '#E14C7A',
                            '#CCC'
                    ]
                }
            });
        }

        function addMobiliari() {
            map.addSource("mobiliari_source", {
                type: "vector",
                url: "mapbox://armillas7.0zjw01ii"
            });

            map.addLayer({
                "id": "mobiliari",
                "type": "symbol",
                'source': "mobiliari_source",
                'source-layer': "mobiliari-bwrsx6",
                "layout": {
                    "icon-image": [
                        "match",
                        ["get", "MOB_TYPE"],
                        ["FANAL"],
                        "marker-11",
                        ["BUS"],
                        "bus",
                        ["BANC"],
                        "picnic-site-15",
                        ["SEMAFOR"],
                        "traffic-signal",
                        "park-11"
                    ]
                }
            });
        }

        function addEstructura() {
            map.addSource("estructura_source", {
                type: "vector",
                url: "mapbox://armillas7.7w4ontwt"
            });

            map.addLayer({
                id: "estructura",
                type: "fill-extrusion",
                source: "estructura_source",
                'source-layer': "estructura-8w4ydg",
                "paint": {
                    "fill-extrusion-height": 3,
                    "fill-extrusion-color": "#BBB"
                }
            });
        }
    });

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

    $('#checkbox-extrusion').change(function() {
        if(!this.checked) {
            map.setLayoutProperty("estructura", 'visibility', 'none');
        } else {
            map.setLayoutProperty("estructura", 'visibility', 'visible');
        }
    });

    $('#checkbox-mobiliari').change(function() {
        if(!this.checked) {
            map.setLayoutProperty("mobiliari", 'visibility', 'none');
        } else {
            map.setLayoutProperty("mobiliari", 'visibility', 'visible');
        }
    });

    map.on('click', 'sepultures-any', function (e) {
        addPopup(e);
    });

    map.on('click', 'sepultures-tipus', function (e) {
        addPopup(e);
    });

    function addPopup(e) {
        console.log(e);
        var sepYear = e.features[0].properties["ANY_CONST"];
        var sepLocator = e.features[0].properties["LOCALITZAD"];
        var sepConstName = e.features[0].properties["NOMCONST"].toLowerCase();
        var sepDpt = e.features[0].properties["NOMDPT"].toLowerCase();
        var sepLayer = e.features[0].properties["LAYER"];

        var popupTxt = '';

        popupTxt +=
            '<div class="popup">' +
                '<div class="popup-title">' +
                    '<span class="pt-const-type">' + sepConstName + '</span>' +
                    '<span class="pt-locator">' + sepLocator + '</span>' +
                '</div>' +
                '<div class="details">' +
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
                        '<span class="title">Localitzador: </span>' +
                        '<span class="detail-txt">' + sepLocator + '</span>' +
                    '</div>' +
                    '<div class="detail">' +
                        '<span class="title">Capa font: </span>' +
                        '<span class="detail-txt">' + sepLayer + '</span>' +
                    '</div>' +
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