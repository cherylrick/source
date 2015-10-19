var spaApp = angular.module('spaApp', ['ngRoute']);

spaApp.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    
    $routeProvider

        .when('/',  {
            templateUrl: 'pages/main.html',
            controller: 'mainController'
        })

        .when('/slides', {
            templateUrl: 'pages/slides.html',
            controller: "slidesController"
        })
        
        .when('/animations', {
            templateUrl: 'pages/animations.html',
            controller: "animationsController"
        })
    
        .when('/forms', {
            templateUrl: 'pages/forms.html',
            controller: "formsController"
        })
        
        .when('/faqs', {
            templateUrl: 'pages/faqs.html',
            controller: "faqsController"
        })
    
        .when('/links', {
            templateUrl: 'pages/links.html',
            controller: "linksController"
        })
    
        .when('/photoGallery', {
            templateUrl: 'pages/photoGallery.html',
            controller: "photoGalleryController"
        });
}]);


spaApp.controller('NavigationCtrl', ['$scope', '$location', function ($scope, $location) {
    'use strict';
    // http://www.ngroutes.com/questions/AUuAF88Sa5vEqxqlLHbc/how-to-highlight-a-current-menu-item.html
    // Lemajd answered on 2013-09-19 12:30
    $scope.isCurrentPath = function (path) {
        return $location.path() === path;
    };
}]);


spaApp.controller('mainController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
  /*  if ($('#content').length <= 1)  {
        $('label[for=show]').show();
        $('label[for=hide]').hide();
    } else  {
        $('label[for=show]').hide();
        $('label[for=hide]').show();
    } 
    */
	
}]);

spaApp.controller('slidesController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
 /*   $scope.images = [{
        src: 'bear.jpg',
        title: 'Pic 1'
    }, {
        src: 'bee.jpg',
        title: 'Pic 2'
    }, {
        src: 'duck.jpg',
        title: 'Pic 3'
    }, {
        src: 'strawberry.jpg',
        title: 'Pic 4'
    }, {
        src: 'water.jpg',
        title: 'Pic 5'
    }];
    
    $scope.currentIndex = 0; // Initially the index is at the first image

    $scope.next = function () {
        $scope.currentIndex < $scope.images.length - 1 ? $scope.currentIndex++ : $scope.currentIndex = 0;
    };

    $scope.prev = function () {
        $scope.currentIndex > 0 ? $scope.currentIndex-- : $scope.currentIndex = $scope.images.length - 1;
    };
    
    $scope.$watch('currentIndex', function () {
        $scope.images.forEach(function (image) {
            image.visible = false; // make every image invisible
        });

        $scope.images[$scope.currentIndex].visible = true; // make the current image visible
    });

    
    $scope.slides = [
        {image: 'images/bear.jpg', description: 'Image 00'},
        {image: 'images/bee.jpg', description: 'Image 01'},
        {image: 'images/duck.jpg', description: 'Image 02'},
        {image: 'images/strawberry.jpg', description: 'Image 03'},
        {image: 'images/water.jpg', description: 'Image 04'}
    ];

    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
        $scope.currentIndex = index;
    };

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };*/
}]);

spaApp.controller('animationsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
	
}]);

spaApp.controller('formsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
 	
}]);

spaApp.controller('faqsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
 	
}]);

spaApp.controller('linksController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
 	
}]);

spaApp.controller('photoGalleryController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	'use strict';
    
  //  $rootScope.currentPage = '/slides';
	
}]);

spaApp.animation('.slide-animation', function () {
    'use strict';
 /*   return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope(),
                finishPoint;

            if (className === 'ng-hide') {
                finishPoint = element.parent().width();
                if (scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            } else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope(),
                startPoint;

            if (className === 'ng-hide') {
                element.removeClass('ng-hide');

                startPoint = element.parent().width();
                if (scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            } else {
                done();
            }
        }
    }; */
});


spaApp.directive('ddTextCollapse', ['$compile', function ($compile) {
    'use strict';
		/* http://stackoverflow.com/questions/21400408/create-read-more-link-in-angularjs  */
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, element, attrs) {

            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function () {
                scope.collapsed = !scope.collapsed;
            };

            // wait for changes on the text
            attrs.$observe('ddTextCollapseText', function (text) {

                // get the length from the attributes
                var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength),
                        secondPart = String(text).substring(maxLength, text.length),

                        // create some new html elements to hold the separate info
                        firstSpan = $compile('<span>' + firstPart + '</span>')(scope),
                        secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope),
                        moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope),
                        lineBreak = $compile('<br ng-if="collapsed">')(scope),
                        toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "more"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(lineBreak);
                    element.append(toggleButton);
                } else {
                    element.empty();
                    element.append(text);
                }
            });
        }
    };
}]);

spaApp.directive('cycle', function () {
    'use strict';
    /* http://stackoverflow.com/questions/19165647/angularjs-directive-for-jquery-cycle-plugin */
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).cycle({
                fx: 'fade',
                timeout: 10
            });
        }
    };
});

spaApp.directive('slider', function ($timeout) {
    'use strict';
    
/*    return {
        restrict: 'AE',
        replace: true,
        scope: {
            images: '='
	    },
        link: function (scope, elem, attrs) {

            scope.currentIndex = 0;

            scope.next = function () {
                scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
            };

            scope.prev = function () {
                scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
            };

            scope.$watch('currentIndex', function () {
                scope.images.forEach(function (image) {
                    image.visible = false;
                });
                scope.images[scope.currentIndex].visible = true;
            }); */

            /* Start: For Automatic slideshow*/

         /*   var timer,
                sliderFunc = function () {
                    timer = $timeout(function () {
                        scope.next();
                        timer = $timeout(sliderFunc, 5000);
                    }, 5000);
                };

            sliderFunc();

            scope.$on('$destroy', function () {
                $timeout.cancel(timer);
            }); */

            /* End : For Automatic slideshow */

     /*   },
                 templateUrl: 'pages/slides.html'
    };*/
});