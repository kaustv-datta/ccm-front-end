import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import * as $ from "jquery";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private dataRoot
  private initialLat
  private initialLon
  private initialZoom
  private mapDiv
  private map
  private lock
  private layerDict
  private startList
  private childList

  constructor() {
  }

  ngAfterViewInit(): void {
    this.initialize()
  }

  private initialize(): void {
    if (typeof (L) == 'undefined') {
      console.log('Please include Leaflet before initializing CarbonMap');
      return;
    }

    //this.dataRoot = 'https://data.cambridgecarbonmap.org';
    this.dataRoot = 'http://localhost:8084/'
    this.initialLat = 52.205;
    this.initialLon = 0.1218;
    this.initialZoom = 12.5;
    this.mapDiv = 'map';

    console.log("Initialised")
    this.map = L.map(this.mapDiv, {
      center: [this.initialLat, this.initialLon],
      zoom: this.initialZoom,
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap/copyright">OpenStreeMap</a>',
    });

    tiles.addTo(this.map);
    this.lock = false;

    var that = this;

    function changeDisplay(layer, mode) {
      if (mode == 0) {
        // Main object, seen on surface, not hovered over
        layer.setStyle({ "fillColor": "#0000ff", "fillOpacity": 0.35, "opacity": 0 })
        layer.bringToFront();
      }
      if (mode == 1) {
        // Parent object, being hover over ///// next iteration: have children show if this mode is stayed on for long enough
        layer.setStyle({ "fillColor": "#ff0000", "fillOpacity": 0.3, "opacity": 0 })
      }
      if (mode == 2) {
        // Parent object, has been selected, so now faint to show children
        layer.setStyle({ "fillColor": "#0000ff", "color": "#cc0000", "fillOpacity": 0, "opacity": 0.3 })
      }
      if (mode == 3) {
        // Child object, parent not selected so is invisible
        layer.setStyle({ "fillColor": "#0000ff", "fillOpacity": 0, "opacity": 0 })
      }
      if (mode == 4) {
        // Child object, parent has been selected so is now visible, not hovered over
        layer.setStyle({ "fillColor": "#669900", "fillOpacity": 0.5, "opacity": 0 })
        layer.bringToFront();
      }
      if (mode == 5) {
        // Child object, being hovered over
        layer.setStyle({ "fillColor": "#ff0000", "fillOpacity": 0.3, "opacity": 0 })
      }
    }

    this.layerDict = {};

    this.map.on('click', function (e) {
      that.lock = !that.lock
    });

    // Will have to generate this in next iteration
    this.startList = findData("index")
    console.log(this.startList)

    this.childList = ["uk.ac.cam.st-edmunds.white-cottage", "uk.ac.cam.st-edmunds.norfolk-building", "uk.ac.cam.st-edmunds.richard-laws", "uk.ac.cam.kings.kingsparade", "uk.ac.cam.kings.spalding", "uk.ac.cam.kings.kingsfield", "uk.ac.cam.kings.garden", "uk.ac.cam.kings.grasshopper", "uk.ac.cam.kings.cranmer", "uk.ac.cam.kings.st-edwards", "uk.ac.cam.kings.tcr", "uk.ac.cam.kings.market", "uk.ac.cam.kings.plodge", "uk.ac.cam.kings.bodleys", "uk.ac.cam.kings.old-site", "uk.ac.cam.kings.provosts-lodge", "uk.ac.cam.kings.webbs", "uk.ac.cam.kings.keynes", "uk.ac.cam.kings.a-staircase", "uk.ac.cam.kings.wilkins"]

    function putOnMap(objjson) {

      let addr = objjson.id

      $.ajaxSetup({
        'async': false,
        'headers': {
          'Access-Control-Allow-Origin': '*',
          "Access-Control-Allow-Credentials": "true",
          'Access-Control-Allow-Methods': "GET",//,HEAD,OPTIONS,POST,PUT",
          'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        }
      });
      $.getJSON(that.dataRoot + "/geojson/" + addr + ".geojson", function (geojson) {
        L.geoJSON(geojson,
          {
            onEachFeature: function (feature, layer) {

              console.log(feature)
              objjson.loadedSubentities = []

              var popup = new L.Popup({
                autoPan: false,
                keepInView: true,
              }).setContent(feature.properties.name);
              layer.bindPopup(popup, { maxWidth: 800 });

              var startmode = 0

              if (that.startList.indexOf(objjson.id) < 0) { startmode = 4 }
              changeDisplay(layer, startmode)

              // Change to objects
              that.layerDict[objjson.id] = [layer, startmode];
              console.log(addr)
              that.map.closePopup();

              layer.on('click', function (e) {
                if (!("link" in objjson)) {
                  console.log("asdf")
                  objjson.link = makeLink(objjson);

                  if (objjson.subentities.length > 0) {
                    objjson.subentities.forEach(j => {
                      objjson.loadedSubentities.push(findData(j))
                      //console.log(objjson.loadedSubentities)
                    })
                    objjson.loadedSubentities.forEach(j => {
                      console.log("about to put on map:" + j.id)
                      putOnMap(j)
                    })
                  }
                }

                // Is a parent, not yet selected, so when it is clicked, it's popup stays the same, but we get it's children turn light green
                if (that.layerDict[addr][1] == 1) {
                  that.layerDict[addr][1] = 2;
                  changeDisplay(that.layerDict[addr][0], that.layerDict[addr][1]);


                  if (objjson.subentities.length > 0) {
                    objjson.subentities.forEach(j => {
                      that.layerDict[j][1] = 4;
                      changeDisplay(that.layerDict[j][0], that.layerDict[j][1]);

                    })
                  }
                }

                // Is a parent that has been selected, now that it is is selected again it will hide all children and go back to normal
                else if (that.layerDict[addr][1] == 2) {
                  that.layerDict[addr][1] = 1;
                  changeDisplay(layer, that.layerDict[addr][1]);

                  if (objjson.subentities.length > 0) {
                    //for (var j in that.childDict[addr]) {
                    objjson.loadedSubentities.forEach(j => {
                      console.log("About to hide: " + j.id)
                      console.log(that.layerDict)
                      that.layerDict[j.id][1] = 3;
                      changeDisplay(that.layerDict[j.id][0], that.layerDict[j.id][1]);

                    })
                  }
                }

                that.lock = !that.lock;

                if (that.lock) {
                  that.map.closePopup();
                  popup.setContent(objjson.link);
                  popup.setLatLng(e.latlng).openOn(that.map);
                }

                else {
                  //popup.setContent(feature.properties.name);
                  popup.setContent(objjson.name);
                }
              });

              layer.on('mouseover', function (e) {
                // Is a parent object, just getting hovered over
                if (that.layerDict[addr][1] == 0) {
                  that.layerDict[addr][1] = 1;
                  changeDisplay(layer, that.layerDict[addr][1]);
                }
                // Is a child, has just been revealed
                else if (that.layerDict[addr][1] == 4 && !that.lock) {
                  that.layerDict[addr][1] = 5;
                  changeDisplay(layer, that.layerDict[addr][1]);
                }

                if (!that.lock && that.layerDict[addr][1] != 3 && that.layerDict[addr][1] != 2) {

                  popup.setLatLng(e.latlng).openOn(that.map);
                  //popup.setContent(feature.properties.name);
                  popup.setContent(objjson.name);
                };


              });

              layer.on('mouseout', function (e) {
                // Is a parent object, was just hovered over but not clicked
                if (that.layerDict[addr][1] == 1) {
                  that.layerDict[addr][1] = 0;
                  changeDisplay(that.layerDict[addr][0], that.layerDict[addr][1]);
                }
                // Is a child, has been revealed but not clicked, so is now going back to 
                else if (that.layerDict[addr][1] == 5) {
                  that.layerDict[addr][1] = 4;
                  changeDisplay(layer, that.layerDict[addr][1]);
                }

                if (!that.lock) {
                  that.map.closePopup();
                }
              });

              layer.on('mousemove', function (e) {

                if (!that.lock && that.layerDict[addr][1] != 3 && that.layerDict[addr][1] != 2) {
                  that.map.closePopup();
                  popup.setLatLng(e.latlng).openOn(that.map);
                }
              });

              popup.setLatLng([0, 0]).openOn(that.map);
              that.map.closePopup();
            }
          }).addTo(that.map);
      });
    }

    Object.keys(that.startList).forEach(function (addr, index) {
      putOnMap(findData(that.startList[index]))
    });

    function findData(id) {
      var obj = null
      $.ajax({
        'async': false,
        'global': false,
        'url': that.dataRoot + `reporting_entities/` + id + `.json`,
        'headers': {
          'Access-Control-Allow-Origin': "*",
          'Access-Control-Allow-Methods': "GET,HEAD,OPTIONS,POST,PUT",
          'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        },
        'dataType': "json",
        'success': function (data) {
          obj = data;
        },
        "error": function (jqXHR, exception) {
          console.log(jqXHR.responseText, id)
        }
      });
      return obj
    }

    //function makeLink(feature) {
    function makeLink(objjson) {
      //
      var div = document.createElement("div");
      div.align = "center"

      var searcher = objjson.id;
      var own = true;
      console.log(objjson)

      //Find closest parent to 
      while (that.startList.indexOf(searcher) < 0) {
        console.log("Entered loop with:", searcher)
        console.log(that.startList)
        own = false;
        searcher = searcher.split(".")
        var popped = searcher.pop()
        searcher = searcher.join(".")
      }

      // var datajson = findData(searcher)
      var href_ = `reporting_entities/${searcher}`

      // NEED to display and normalise (for time) the most recent emissions number

      var toptext = `Emissions data is coming soon! </br> Click here if you want to hear more from us,</br> or involved with the project - we'd love to have you on board`
      var bottext = "Click here"
      href_ = "http://cambridgecarbonmap.org/"

      if (own) {
        //toptext = `Emissions for ${datajson.name}:`
      } else {
        //toptext = `No stats for this building individually! Emissions for ${datajson.name}:`
      }

      div.innerHTML = `
             <p style = "font-size:14px"><a href = "${href_}">${toptext}</a></p>
         `
      //<p style="font-size:25px"><a href = "${href_}">${bottext}</a></p>

      return div
    }
  }
}
