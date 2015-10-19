$(function () {
    'use strict';
    
    var customerInfo = {};
    
    // Google address auto complete
    var initialize = function () {
        var cityInput,
            autocomplete,
            options = {
                types: ['(cities)'],
                componentRestrictions: { country: "us"}
            };
            
        $('#to-be-hidden').hide();
        
        cityInput = document.getElementById('city');
        autocomplete = new google.maps.places.Autocomplete(cityInput, options);
        
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            customerInfo.lat = place.geometry.location.lat();
            customerInfo.long = place.geometry.location.lng();
        });
    };
    
    // showResults() - unhide result section and animate it up
    var showResults = function () {
        $("#to-be-hidden").show();
        $('html, body').animate({ scrollTop: $("#to-be-hidden").offset().top + 10 }, { duration: 1500 });
    };
    
    // calculateSavings() - compute the saving base on the average monthly bill
    var calculateSavings = function () {
        var utilityPrice = 0.23,
            bill = parseInt($("#bill option:selected").val(), 10),
            savings = (bill / utilityPrice) * 12 * 20 * (utilityPrice - customerInfo.solarPrice) / 8;
        
        $('#save').html(Math.round(savings));
        
        showResults();
       // return savings;
    };
    
    // getCompanies(price) - get suggested vendor list base on KWh shown
    var getCompanies = function (price) {
        var category, json, vendorlist = '';
	
        $.ajax({
            url: 'vendors.json',
            dataType: 'json',
            success: function (data) {
                if (price >= 17) {
                    category = data[0].high;
                } else if (price >= 15) {
                    category = data[1].medium;
                } else {
                    category = data[2].low;
                }
                
                $.each(category, function (key, value) {
                    if ($('.suggestion').length > 2) {
                        vendorlist = '';
                        $('#vendors').empty();
                    }
                    
                    vendorlist += '<div class="suggestion">' + '<a class="link-vendor" href="' + value.link +
                        '" target="_blank"><img class="link-img" src="' + value.logo + '" height="75"/></a></div>';
                });

                $('#vendors').append(vendorlist);
            }

        });
    };
        
    // calculatePrice()
    var calculatePrice = function () {
        var roundedPrice,
            tree,
            myInsulation;
        
        tree = parseInt($('input[name="tree"]:checked').val(), 10);
        myInsulation = customerInfo.acAnnual * tree;
        
        customerInfo.solarPrice = 0.4 - myInsulation * (0.00014);
        
        if (customerInfo.solarPrice < 0.11) {
            customerInfo.solarPrice = 0.11;
        }
        
        if (customerInfo.solarPrice > 0.22) {
            customerInfo.solarPrice = 0.22;
        }
        
        roundedPrice = Math.round(customerInfo.solarPrice * 100);
        
        $('#cent').html(roundedPrice);
        
        getCompanies(roundedPrice);
        calculateSavings();
        //return roundedPrice;
    };
    
    // getPrice() 
    var getPrice = function () {
        var tilt = $('input:radio[name=tilt]:checked').val(),
            azimuth = $('input:radio[name=orientation]:checked').val(),
            url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + customerInfo.lat + "&lon=" + customerInfo.long + "&system_capacity=1&module_type=0&losses=5&array_type=1&tilt=" + tilt + "&azimuth=" + azimuth;

        $.ajax({
            url: url,
            type: "GET",
            success: function (response) {
                customerInfo.acAnnual = response.outputs.ac_annual;
                
                calculatePrice();
            }
        });
        
    };
    
    // click on estimate button
    $('#estimate').on('click', function (event) {
        var city = $('#city').val(),
            orientation = $("input[name=orientation]:checked").val(),
            tilt = $("input[name=tilt]:checked").val(),
            tree = $("input[name=tree]:checked").val(),
            bill = $('#bill').val(),
            valid = true;
        
        event.preventDefault();
        
        if (!city) {
            $('#cityError').text("Must enter a valid city name!");
            valid = false;
        }
        
        if (orientation === undefined) {
            $('#orientationError').text("Must select how the house facing the Sun!");
            valid = false;
        }
        
        if (tilt === undefined) {
            $('#tiltError').text("Must select the roof tilt style!");
            valid = false;
        }
        
        if (tree === undefined) {
            $('#treeError').text("Must select the tree coverage of the house!");
            valid = false;
        }
        
        if (valid) {
            getPrice();
        }
        
    });
    
    $('#city').change(function () {
        $('#cityError').fadeOut("slow", function () {
            $(this).empty();
        });
    });
    
    $('#orientation').change(function () {
        $('#orientationError').fadeOut("slow", function () {
            $(this).empty();
        });
    });
        
    $('#tilt').change(function () {
        $('#tiltError').fadeOut("slow", function () {
            $(this).empty();
        });
    });
        
    $('#tree').change(function () {
        $('#treeError').fadeOut("slow", function () {
            $(this).empty();
        });
    });
    
    google.maps.event.addDomListener(window, 'load', initialize);
});

