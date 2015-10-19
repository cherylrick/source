'use strict';

$(function () {
    var locationInfo = {},
        startGeo = {},
        directionsDisplay,
        directionsService = new google.maps.DirectionsService(),
        map,
        fromlocation,
        tolocation = "San Francisco, CA.";
    
    // Google address auto complete
    var initializeSearch = function () {
        var input,
            autocomplete,
            options = {
                types: [],
                componentRestrictions: { country: "us"}
            };
           
        $('#locations').hide();
        $('#infobox').hide();
        
        input = document.getElementById('destination');
        autocomplete = new google.maps.places.Autocomplete(input, options);
        
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            tolocation = place.formatted_address;
            locationInfo.lat = place.geometry.location.lat();
            locationInfo.long = place.geometry.location.lng();
        });
    };
    
    google.maps.event.addDomListener(window, 'load', initializeSearch);
    
    /* show my current location */
    // Show current address on the map
    var showGoogleMaps = function () {
            var marker,
                latLng = new google.maps.LatLng(startGeo.lat, startGeo.lng),
                mapOptions = {
                    zoom: 14, // initialize zoom level - the max value is 21
                    center: latLng /*,
                    streetViewControl: false, // hide the yellow Street View pegman
                    scaleControl: true, // allow users to zoom the Google Map
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    
                    zoomControl: false,
                    mapTypeControl: false,
                    panControl: false */
                };
            directionsDisplay = new google.maps.DirectionsRenderer();
            map = new google.maps.Map(document.getElementById('map_canvas'),
                 mapOptions);
            directionsDisplay.setMap(map);
        
             // Show the default red marker at the location
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP
            });
        };
  
  //  google.maps.event.addDomListener(window, 'load', showGoogleMaps);
    
    var fromAddress = function () {
        var geocoder  = new google.maps.Geocoder();             // create a geocoder object
        var location  = new google.maps.LatLng(startGeo.lat, startGeo.lng);

        // turn coordinates into an object          
        geocoder.geocode({'latLng': location}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {           // if geocode success
                var address = results[0].formatted_address;         // if address found, pass to processing function
                fromlocation = address;
            //    return address;
            }
        });
    };
    
    var showPosition = function (position) {
        startGeo.lat = position.coords.latitude;
        startGeo.lng = position.coords.longitude;
        
        showGoogleMaps();
        fromAddress();
    };
    
    var getCurrentLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    };
    
    getCurrentLocation();
    
    // calculate route between start and stop point
    function calcRoute() {
        var start = fromlocation;
        var end = tolocation; //document.getElementById('destination').value;
        //  console.log('start -', start, ', end -', end);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }
    
  /*  $('#destination').on('change', function () {
        calcRoute();
    });
   */
    
    // showResults() - unhide result section and animate it up
    var showResults = function () {
        $("#infobox").show();
        $('html, body').animate({
            scrollTop: $("#infobox").offset().top + 10
        }, { duration: 3000 });
    };
    
    var getTimes = function () {
        var category, json, vendorlist = '';

        $.ajax({
            type: 'GET',
            url: 'data/times.json',    //'http://uhhjjhekfx.localtunnel.me/json',
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
             /*   $.each(data, function (key, value) {
                        //$("#to_time").html(value.TimeSinceBreak);
                        $("#to_time").html(value.needToDrive);
                        $("#time_used").html(value.drived);
                        $('#time_to_rest').html(value.needRest);
                        console.log(key + ": " + value.needToDrive);
                });*/

                var i = 0, ii = data.length;

                (function timeLoop() {
                    $("#to_time").html(data[i].needToDrive);
                    $("#time_used").html(data[i].drived);
                    $('#time_to_rest').html(data[i].nextRest);
                    i++;
                    if (i < ii) {
                        setTimeout(timeLoop, 7000);
                    } else {
                        return;
                    }

                }());
            }

        });
    };
    
    $('#track').click(function () {
        tolocation = $('#destination').val();
        locationInfo.from = fromlocation; //"Moscone West, San Francisco, CA";
        locationInfo.to = tolocation;
        calcRoute();
        $("#fromlocation").html(locationInfo.from);
        $("#tolocation").html(locationInfo.to);
        $('#locations').show(1000);
        $('#search_field').hide();
        $('#infobox').slideDown("slow", function () {
            // action
        });
        getTimes();
      //  console.log(locationInfo);
    });
    
    $("#toggleBtn").click(function () {
        $('.slideToggle').slideToggle();
    });
    
});



