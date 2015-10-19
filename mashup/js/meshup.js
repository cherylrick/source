$(document).ready(function() {
    $('#submit').click(function() {            
        var zip = $('#zipcode').val();
        var radius = $('#radius').val();
        var category = $('#category').val();
        if (zip && !(/^\s*\d{5}\s*$/.test($('#zipcode').val()))) {
          $('.error').text(' invalid zip code entered, please try again');
        } else {
          $('.error').text('');
        }            
        
        clear_list("mycoupons");
        $('#map').empty();
        searchAndDisplay(zip, radius, category);
    });
});  

function clear_list(list) {
  var list = document.getElementById(list);
  while (list.hasChildNodes()) {
    list.removeChild(list.lastChild);
  }
}
    
function searchAndDisplay(zip, radius, category) {    
  var myurl = 'http://api.8coupons.com/v1/getdeals?key=82cb2645283a89fe53352968298a7fd61ad8386f5110836008c14e1435faf5b3a8f063a5ce613aa22b528c095b429ee2&zip='+zip+'&mileradius='+radius+'&limit=5&orderby=radius&categoryid='+category+'';
  var info = [];
  
  $.ajax({
    url: myurl, 
    dataType: 'jsonp',
    success: function(data) {
      var coupons = $('#coupons'); 
      var latLngMarker, i = 0;    
      // setup LatLng with first lat, lon of return results
      var latlng = new google.maps.LatLng(data[1].lat, data[1].lon);
      var options = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }; 
      // display map with first lat, lon of return results
      var myMap = new google.maps.Map(document.getElementById('map'), options);           
      for (res in data) {
        info.push("<li><b>" + 
          data[res].name + "</b><br />" + 
          data[res].address + ", " + 
          data[res].city + ", " + 
          data[res].state + " " + 
          data[res].ZIP + "<br />Phone: " + 
          data[res].phone + "<br />Deal: " +
          data[res].dealTitle + "<br />" + '<a href="' +
          data[res].storeURL + '">Store coupon</a>' +
          "</li><br />");      
          
        i++;
        // get lat and lon for current Marker
        latLngMarker = new google.maps.LatLng(data[res].lat, data[res].lon);
        // set icon shadow dimension and location relative to marker icon
        var shadowIcon = new google.maps.MarkerImage(
          'http://maps.google.com/mapfiles/ms/micons/msmarker.shadow.png',
          new google.maps.Size(59, 32),	// size
          new google.maps.Point(0,0),	// origin
          new google.maps.Point(16, 32)	// anchor
        );
        // Creating a marker and putting it on the map
        marker = new google.maps.Marker({
          position: latLngMarker,
          map: myMap,
          icon:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+i+'|FF776B|000000',
          shadow: shadowIcon, 
          title: data[res].name
        });
        infoWin(marker, myMap, data[res])
      }
      
      $('#coupons>p').text('Coupons info -');
      $('#mycoupons').append(info.join(' '));          
    }
  });
}

function infoWin (marker, map, data) {    
  var infoWindow = new google.maps.InfoWindow({ maxWidth: 150 });
  // Attaching a click event to the current marker
  google.maps.event.addListener(marker, "click", function(e) {
    infoWindow.setContent("<b>" + data.name + "</b><br />" + data.dealinfo);
    infoWindow.open(map, marker);
  });
}   