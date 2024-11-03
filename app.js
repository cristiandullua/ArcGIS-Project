require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Popup",
    "esri/renderers/UniqueValueRenderer"
], function (esriConfig, Map, MapView, FeatureLayer, Popup, UniqueValueRenderer) {
    esriConfig.apiKey = "AAPK3cfac78754db415896514df2decf2bf9aDitR91qW3VPxft0XGw71UROMhPFWrFJz6Oc-eTxCGth8AwStjuZLXR7_DviwPi7";

    const map = new Map({
        basemap: "arcgis/topographic"
    });

    const view = new MapView({
        map: map,
        center: [-80.1918, 25.7617], // Miami coordinates: [longitude, latitude]
        zoom: 13,
        container: "viewDiv"
    });

    // Define the feature layer URL
    const featureLayerUrl = "https://services1.arcgis.com/CvuPhqcTQpZPT9qY/arcgis/rest/services/Landmarks/FeatureServer/0";

    // Create a feature layer
    const featureLayer = new FeatureLayer({
        url: featureLayerUrl,
        outFields: ["*"], // Retrieve all fields
        renderer: createRenderer() // Use a custom renderer function
    });

    // Add the feature layer to the map
    map.add(featureLayer);

    // Create a PopupTemplate for displaying information in the popup
    const popupTemplate = {
        title: "{LMNAME}", // Use the field name from your data
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "LMADDRESS", label: "Address" },
                    { fieldName: "LMCNAME", label: "Category" }
                ]
            }
        ]
    };

    // Create a Popup widget
    const popup = new Popup({
        view: view,
        content: "Loading..."
    });

    // Set the PopupTemplate for the feature layer
    featureLayer.popupTemplate = popupTemplate;

    // Add an event listener to the feature layer to show the popup on click
    view.whenLayerView(featureLayer).then(function (layerView) {
        layerView.watch("updating", function (value) {
            if (!value) {
                view.on("click", function (event) {
                    view.hitTest(event).then(function (response) {
                        if (response.results.length) {
                            const graphic = response.results[0].graphic;
                            popup.title = graphic.attributes.LMNAME;
                            popup.content = popupTemplate.content; // Use the configured content
                            popup.open({
                                location: event.mapPoint
                            });
                        }
                    });
                });
            }
        });
    });

    // Function to create a renderer based on the LMCNAME field
    function createRenderer() {
        return {
            type: "unique-value", // Unique value renderer
            field: "LMCNAME", // Use the LMCNAME field for unique values
            uniqueValueInfos: [
                {
                    value: "School", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/5310/5310672.png", // Path to the school icon
                        width: "42px",
                        height: "42px"
                    }
                },
                {
                    value: "Church", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/2750/2750145.png", 
                        width: "42px",
                        height: "42px"
                    }
                },
                {
                    value: "Park", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/2892/2892332.png",
                        width: "42px",
                        height: "42px"
                    }
                },
                {
                    value: "Hospital", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/965/965157.png",
                        width: "42px",
                        height: "42px"
                    }
                },
                {
                    value: "Police Station", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/3863/3863479.png",
                        width: "42px",
                        height: "42px"
                    }
                },
                {
                    value: "MetroRail Station", // Value from the LMCNAME field
                    symbol: {
                        type: "picture-marker", // Use picture marker symbol
                        url: "https://cdn-icons-png.flaticon.com/512/985/985197.png",
                        width: "42px",
                        height: "42px"
                    }
                },
            ]
        };
    }
});