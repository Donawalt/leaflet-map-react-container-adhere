import React, { useEffect } from "react";
import L from "leaflet";

function Map(height, width) {
  useEffect(() => {
    var circles = [];
    var maker = [];
    var currentData = [];
    var maker1 = [];
    var nivZoom = 13; // initial zoom level
    var currentView = [48.8620543, 2.3449645];

    var eventLocation = [
      {
        name: "Gare de Lyon",
        location: [48.8443038, 2.3743773],
        stations: 0
      },
      {
        name: "Chatelet les Halles",
        location: [48.8620543, 2.3449645],
        stations: 0
      },
      {
        name: "Nation ",
        location: [48.8483634, 2.393789],
        stations: [
          {
            name: "rue des boulet",
            location: [48.8522705, 2.3872059]
          },
          {
            name: "picpus",
            location: [48.8449438, 2.3990587]
          }
        ]
      }
    ]; //dummy data in the goal to try  the principle

    var Icon = L.icon({
      // Création d'icone personalisée
      iconUrl: "./epreuve.png", // Créer une variable suivant une condition

      iconSize: [50, 63], // size of the icon
      iconAnchor: [25, 63], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    }); // We initialise the icon

    var stationIcon = L.icon({
      // Création d'icone personalisée
      iconUrl: "./station.png", // Créer une variable suivant une condition

      iconSize: [30, 34], // size of the icon
      iconAnchor: [25, 34], // point of the icon which will correspond to marker's location
      popupAnchor: [-10, -34] // point from which the popup should open relative to the iconAnchor
    }); // We initialise the icon

    var mymap = L.map("map_id").setView(currentView, nivZoom); // we initialize the map

    const init = () => {
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZG9uYXdhbHQiLCJhIjoiY2s2aG96NWFnMWNobTNlbnZ2aG9pa2ZpNSJ9.nNX6JxGCXLmb91C0NpSaWw",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a> by students from HETIC',
          maxZoom: 18,
          id: "donawalt/ck6hp89630sim1iqoifge5e0x",
          accessToken:
            "pk.eyJ1IjoiZG9uYXdhbHQiLCJhIjoiY2s2aG96NWFnMWNobTNlbnZ2aG9pa2ZpNSJ9.nNX6JxGCXLmb91C0NpSaWw"
        }
      ).addTo(mymap); // We had the tile layer from mapbox

      mymap.dragging.disable();
    };

    const onClickPin = (el, data) => {
      maker[el].on("click", e => {
        nivZoom = 15;
        currentView = currentData[el].location;
        mymap.setView(currentData[el].location, nivZoom);

        mymap.on("zoomend", function() {
          var mapCenter = mymap.getCenter();
          var pinLocation = L.latLng(data.location);
          var mapCenterLat = (Math.round(mapCenter.lat * 1000) / 1000).toFixed(
            3
          );
          var mapCenterLng = (Math.round(mapCenter.lng * 1000) / 1000).toFixed(
            3
          );
          var pinLocationLat = (
            Math.round(pinLocation.lat * 1000) / 1000
          ).toFixed(3);
          var pinLocationLng = (
            Math.round(pinLocation.lng * 1000) / 1000
          ).toFixed(3);

          if (
            mapCenterLat === pinLocationLat &&
            mapCenterLng === pinLocationLng
          ) {
            var eventStations = currentData[el].stations;
            if (eventStations.length > 1) {
              eventStations.map(function(d1, index) {
                var maker1Value = L.marker(d1.location, {
                  icon: stationIcon
                }).on("click", () => {
                  alert(d1.name);
                });
                maker1.push(maker1Value);
                maker1.forEach(element => {
                  mymap.removeLayer(element);
                });
                var zoomlevel = mymap.getZoom();
                if (zoomlevel < 15) {
                  mymap.removeLayer(maker[el]);
                  maker.forEach(element => element.addTo(mymap));
                  mymap.removeLayer(circles[el]);
                  maker1.forEach(element => {
                    mymap.removeLayer(element);
                    maker1 = [];
                  });
                } else if (zoomlevel >= 15) {
                  maker.forEach(element => mymap.removeLayer(element));
                  maker[el].addTo(mymap);
                  mymap.addLayer(circles[el]);
                  maker1.forEach(element => {
                    element.addTo(mymap);
                  });
                }
                console.log("Current Zoom Level =" + zoomlevel);
              });
            } else {
              var zoomlevel = mymap.getZoom();
              if (zoomlevel < 15) {
                maker.forEach(element => element.addTo(mymap));
                mymap.removeLayer(circles[el]);
              } else if (zoomlevel >= 15) {
                maker.forEach(element => mymap.removeLayer(element));
                maker[el].addTo(mymap);
                mymap.addLayer(circles[el]);
              }
            }
          }
        });
      });
    };

    const instance = () => {
      eventLocation.map((d, i) => {
        currentData.push(d);
        var makerValue = L.marker(currentData[i].location, { icon: Icon });
        var circleValue = L.circle(currentData[i].location, {
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.1,
          radius: 750
        });

        maker.push(makerValue);
        circles.push(circleValue);
        maker[i].addTo(mymap);
        maker[i].bindPopup(
          "<b>" + currentData[i].name + "</b><br>" + currentData[i].location
        );

        return onClickPin(i, d);
      });
    };

    const main = () => {
      init();
      instance();
    };

    return main(); // Run the main  function
  }, []);
  return <div id="map_id" className="map" style={height} />;
}

export default Map;
