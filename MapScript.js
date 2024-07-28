require(["esri/layers/FeatureLayer","esri/widgets/Expand","esri/widgets/AreaMeasurement2D","esri/config","esri/Map", "esri/views/MapView","esri/widgets/BasemapGallery","esri/request","esri/rest/locator","esri/Graphic","esri/symbols/WebStyleSymbol","esri/rest/route","esri/rest/support/RouteParameters","esri/rest/support/FeatureSet"],
          (FeatureLayer,Expand,AreaMeasurement2D,esriConfig,Map, MapView,BasemapGallery,esriRequest,locator,Graphic,WebStyleSymbol,route,RouteParameters,FeatureSet) => {

    esriConfig.apiKey = "AAPK19d83ce504904e678401500e24226fd3lgMmWRKTeKRXgyQXl1Do-B_XTipyu0QGbWrx3A2KquUMgfdeAo9MepIY3jm85dgr"
var mymap = new Map({
    basemap : "arcgis-streets-relief"
})

var myview = new MapView({
    map:mymap,
    container: "mapp",
    center: [30, 30],
    zoom: 5,


 })

 myview.on("click", function(e){
    console.log(e.mapPoint)
    // myview.goTo({center:[e.mapPoint.longitude,e.mapPoint.latitude],
    //     zoom: 10,
    // },{duration:3000})
 })

 var basemapGallery = new BasemapGallery({
    view: myview,
 })
 const measurementWidget = new AreaMeasurement2D({
  view: myview
});
const layerListExpand = new Expand({
  expandIcon: "basemap",  // see https://developers.arcgis.com/calcite-design-system/icons/
  // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
  view: myview,
  content: basemapGallery
});

// myview.ui.add(basemapGallery,"top-right")
myview.ui.add(layerListExpand, "top-right");
myview.ui.add(measurementWidget, "bottom-left");

const template = {
  // NAME and COUNTY are fields in the service containing the Census Tract (NAME) and county of the feature
  title: "{CITY_NAME} in {CNTRY_NAME}",
  content: `
 <b>City:</b> {CITY_NAME}
  <br>
  <b>Country:</b> {CNTRY_NAME}
  <br>
  <b>Population:</b> {POP}
  <br>
  <ul>
    <li>Pop :{POP}</li>
    <li>Rank: {POP_RANK}</li>
    <li>Class: {POP_CLASS}</li>
    <li>Status: {STATUS}</li>
    <li>FIPS: {FIPS_CNTRY}</li>
    <li>Admin: {GMI_ADMIN}</li>
    <li>Admin Name: {ADMIN_NAME}</li>
  </ul>
  
  <br>
  
`
};

const myRender ={
    type: "class-breaks",
    field: "POP",
    classBreakInfos: [
      {
        minValue: 0,
        maxValue: 1000000,
        symbol: {
            type: "simple-marker",
            color: "red",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
      {
        minValue: 1000000,
        maxValue: 2000000,
        symbol: {
            type: "simple-marker",
            color: "blue",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
      {
        minValue: 2000000,
        maxValue: 3000000,
        symbol: {
            type: "simple-marker",
            color: "green",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
      {
        minValue: 3000000,
        maxValue: 4000000,
        symbol: {
            type: "simple-marker",
            color: "yellow",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
      {
        minValue: 4000000,
        maxValue: 5000000,
        symbol: {
            type: "simple-marker",
            color: "orange",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
      {
        minValue: 5000000,
        maxValue: 6000000,
        symbol: {
            type: "simple-marker",
            color: "purple",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },{
        minValue: 6000000,
        maxValue: 7000000,
        symbol: {
            type: "simple-marker",
            color: "green",
            size: 10,
            style : "circle",
            outline: {
                color: "white",
                width: 1
            }}
      },
    ],
    defaultSymbol:{
        type: "simple-marker",
        color: "black",
        size: 10,
        style : "circle",
        outline: {
            color: "white",
            width: 1
        }   
    }
}
const mylayer = new FeatureLayer({
  // URL to the service
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0",
    //  definitionExpression: "CNTRY_NAME = 'brazil'",
     outFields: ["CITY_NAME", "CNTRY_NAME"],
     popupTemplate: template,
    renderer:myRender,
     opacity: 0.5,
});

mylayer.on("layerview-create",()=>{

    mylayer.queryExtent()
.then(function(response){
    myview.goTo(response.extent,{duration :4000})

})


})


mymap.add(mylayer);
var requestURl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/world_cities/FeatureServer/0/query"
var requireOPT ={
    query : {
        where: "POP > 1000000",
        // outFields: ["CITY_NAME", "CNTRY_NAME","PoP"],
        outFields: ["*"],
        returnGeometry: true,
        outSR: 102100,
        f: "json"

    }
}

var selCountry = document.getElementById("selCountry")
var selCity = document.getElementById("selCity")

esriRequest(requestURl, requireOPT).then((res) => {
    var array = res.data.features;
    console.log(array);
    selCountry.options.length = 0;
    var countryUnique = [];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (!countryUnique.includes(element.attributes.CNTRY_NAME)) {
            countryUnique.push(element.attributes.CNTRY_NAME);
        }
    }

    countryUnique.sort();
    var option = document.createElement("option");
    option.value = "All";
    option.text = "All";
    selCountry.add(option);

    for (let i = 0; i < countryUnique.length; i++) {
        var option = document.createElement("option");
        option.value = countryUnique[i];
        option.text = countryUnique[i];
        selCountry.add(option);
    }
});
selCountry.addEventListener("change" , (e)=>{
   var county = e.target.value
    if (e.target.value=="All") {
    mylayer.definitionExpression= ""
    requireOPT.query.where = "POP > 1000000"
        
    }else{
    mylayer.definitionExpression=`CNTRY_NAME = '${e.target.value}'`
    requireOPT.query.where = `CNTRY_NAME = '${e.target.value}'`
  }
  mylayer.queryExtent()
    .then(function(response){
        myview.goTo(response.extent,{duration :4000})})

esriRequest(requestURl, requireOPT).then((res) => {
    console.log(res)
    var array = res.data.features;
    console.log(array);
    selCity.options.length = 0;
    var cityUnique = [];

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (!cityUnique.includes(element.attributes.CITY_NAME)) {
            cityUnique.push(element.attributes.CITY_NAME);
        }
    }

    cityUnique.sort();


    for (let i = 0; i < cityUnique.length; i++) {
        var option = document.createElement("option");
        option.value = cityUnique[i];
        option.text = cityUnique[i];
        selCity.add(option);
    }
    
})
selCity.addEventListener("change" , (ee)=>{
    if (e.target.value=="All") {
        mylayer.definitionExpression=`CITY_NAME = ""`
        requireOPT.query.where = `CITY_NAME = ""`
        mylayer.definitionExpression=`CNTRY_NAME = '${county}'`
        requireOPT.query.where = `CNTRY_NAME = '${county}'`
        
    }else{
    mylayer.definitionExpression=`CITY_NAME = '${ee.target.value}'`
    requireOPT.query.where = `CITY_NAME = '${ee.target.value}'`
  }
  mylayer.queryExtent()
    .then(function(response){
        myview.goTo(response.extent,{duration :4000})})

})

})

function findPlaces(point) {

    var geocodingServiceUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    var paramss = {
        categories : ["Burgers"],
        location : point,
        maxLocations : 10,
        outFields : ["*"],
        // f : "json"
        
    }
    myview.graphics.removeAll();
    // لكل  place هضيفله graphic 
    locator.addressToLocations(geocodingServiceUrl,paramss).then((places)=>{
        console.log(places)

        places.forEach((place)=>{
            var myGraphics = new Graphic({
                attributes:place.attributes,
                geometry: place.location,
                symbol:new WebStyleSymbol({
                    name: "restaurant",
                    styleName: "Esri2DPointSymbolsStyle"
                  }),
                  popupTemplate:{
                    title:"{PlaceName}",
                    content:"{Place_addr}"
                  }

            })
            myview.graphics.add(myGraphics)
        })
    })
}





///---------------------Routing----------------------------

var routeURL = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
//Param for network
var routeParams = new RouteParameters({
    directionsLanguage: "en",
    directionsLengthUnits: "kilometers",
    returnDirections: true,
    stops: new FeatureSet()

})
function getRoute() {

    route.solve(routeURL, routeParams).then(function (result) {
        console.log(result)
        alert("routing")

        var myRouteLayer = result.routeResults[0].route

        myRouteLayer.symbol = {
            type: "simple-line",
            color: "red",
            width: 3
        }
        myRouteLayer.popupTemplate = {
            title: "Route",
            content: "Distance: {Total_Kilometers} Km",
            //add name the route+


            fieldInfos: [{
                fieldName: "Total_Kilometers",
                format: {
                    digitSeparator: true,
                    places: 2
                }
            }],
            outFields: ["Total_Kilometers"], 
            titleField: "Total_Kilometers",
            contentField: "Total_Kilometers",
            showAttachments: true,
            showLegend: true,
            showAttachments: true,
            showAttachments: true,
            showLegend: true,
        }


        myview.graphics.add(myRouteLayer)

    })

}

function addStop(pt) {
    var myGraphic = new Graphic({
        geometry: pt,
        symbol: new WebStyleSymbol({
            name: "box-pin",
            styleName: "Esri2DPointSymbolsStyle"
        }),
    })
    myview.graphics.add(myGraphic)
    // SAParams.facilities.features.push(myGraphic)
    // if (SAParams.facilities.features.length == 1) {
    //     getSA()
    // }

    routeParams.stops.features.push(myGraphic)

    if (routeParams.stops.features.length ==2) {
        getRoute()
    }
}

myview.on('click', (e)=>{
    // findPlaces(e.mapPoint)
    if (routeParams.stops.features.length <2||routeParams.stops.features.length==null ||routeParams.stops.features.length==undefined) {
    addStop(e.mapPoint)
    }
})


})