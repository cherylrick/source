'use strict';

// module
var solarApp = angular.module('solarApp', []);

// controllers - main
solarApp.controller('mainController', ['$scope', '$http', function ($scope, $http) {
	    
    $scope.formData = {};
    $scope.customerInfo = {};
    $('#to-be-hidden').hide();
        
    // validate all input fields are entered 
    $scope.init = function () {
        $scope.cityRequired = '';
        $scope.orientationRequired = '';
        $scope.tiltRequired = '';
        $scope.treeRequired = '';
        $scope.billRequired = '';
        $scope.show = false;
        
        if (!$scope.formData.city) {
            $scope.cityRequired = 'Must enter a valid city name!';
        }
        
        if (!$scope.formData.orientation || $scope.formData.orientation === undefined) {
            $scope.orientationRequired = 'Must select which way the house facing Sun in the morning!';
        }
        
        if (!$scope.formData.tilt || $scope.formData.tilt === undefined) {
            $scope.tiltRequired = "Select the roof style!";
        }
        
        if (!$scope.formData.tree || $scope.formData.tree === undefined) {
            $scope.treeRequired = "Trees surrounded the roof!";
        }
        
        if (!$scope.formData.bill || $scope.formData.bill === undefined) {
            $scope.billRequired = "Select your average monthly electric bill!";
        }
        
        // get price information
        if ($scope.formData.city && $scope.formData.orientation && $scope.formData.tilt && $scope.formData.tree && $scope.formData.bill) {
            
            $scope.getPrice();
        }
    };
    
    $scope.$watch('formData.city', function () {
        if ($scope.formData.city === undefined) {
            return $scope.cityRequired;
        }
        
        if ($scope.formData.city.length > 1) {
            $scope.cityRequired = '';
        }
    });
    
    $scope.$watch('formData.orientation', function () {
        $scope.orientationRequired = '';
    });
    
    $scope.$watch('formData.tilt', function () {
        $scope.tiltRequired = '';
    });
    
    $scope.$watch('formData.tree', function () {
        $scope.treeRequired = '';
    });
    
    $scope.$watch('formData.bill', function () {
        $scope.billRequired = '';
    });
  

    // calculate the acAnnual price per roof tilt and house orientation
    $scope.getPrice = function () {
        $scope.url = "https://developer.nrel.gov/api/pvwatts/v5.json?api_key=xwLd5WSQRkNkNnecjrj3sCjiWtBn0dromb64lMvV&lat=" + $scope.customerInfo.lat + "&lon=" + $scope.customerInfo.long + "&system_capacity=1&module_type=0&losses=5&array_type=1&tilt=" + $scope.formData.tilt + "&azimuth=" + $scope.formData.orientation;
    
        $http.get($scope.url)
            .success(function (response) {
                $scope.customerInfo.acAnnual = response.outputs.ac_annual;
            
                $scope.calculatePrice();
                return $scope.customerInfo.acAnnual;
                
            })
            .error(function (data, status) {
                console.log('data:', data, ' status:', status);
            });
    };
    
    // calculate how many cents per kWh base on form inputs
    $scope.calculatePrice = function () {
        $scope.myInsulation = $scope.customerInfo.acAnnual * parseInt($scope.formData.tree, 10);
        $scope.customerInfo.solarPrice = 0.4 - $scope.myInsulation * (0.00014);
        
        
        if ($scope.customerInfo.solarPrice < 0.11) {
            $scope.customerInfo.solarPrice = 0.11;
        } else if ($scope.customerInfo.solarPrice > 0.22) {
            $scope.customerInfo.solarPrice = 0.22;
        }
        
        $scope.customerInfo.roundedPrice = Math.round($scope.customerInfo.solarPrice * 100);
        
        $scope.calculateSavings();
        return $scope.customerInfo.roundedPrice;
    };
    
    // calculate estimate annual saving
    $scope.calculateSavings = function () {
        $scope.utilityPrice = 0.23;
        $scope.savings = (parseInt($scope.formData.bill, 10) / $scope.utilityPrice) * 12 * 20 * ($scope.utilityPrice - $scope.customerInfo.solarPrice) / 8;
        
        $scope.savings = Math.round($scope.savings);
        $scope.getCompanies();
        return $scope.savings;
    };
    
    // get suggested companies base on suggested kWh price
    $scope.getCompanies = function () {
        
        $http.get('vendors.json')
            .success(function (result) {
                if ($scope.customerInfo.roundedPrice >= 17) {
                    $scope.vendors = result[0].high;
                } else if ($scope.customerInfo.roundedPrice >= 15) {
                    $scope.vendors = result[1].medium;
                } else {
                    $scope.vendors = result[2].low;
                }
                
                $scope.show = true;
                $("#to-be-hidden").show();
                $('html, body').animate({ scrollTop: $("#to-be-hidden").offset().top + 10 }, { duration: 1500 });
            })
            .error(function (data, status) {
                console.log('data:', data, ' status:', status);
            });
    };
    
	
}]);

// get lat and lng of the city entered
solarApp.directive('googleplace', function () {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, model) {
            var options = {
                    types: ['(cities)'],
                    componentRestrictions: {country: 'us'}
                },
                autocomplete = new google.maps.places.Autocomplete(element[0], options);
            
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
            
                var place = autocomplete.getPlace();
                $scope.formData.city = place.formatted_address;
                $scope.customerInfo.lat = place.geometry.location.lat();
                $scope.customerInfo.long = place.geometry.location.lng();
            });
        }
    };
});
