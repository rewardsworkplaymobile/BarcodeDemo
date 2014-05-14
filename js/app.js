// define our application and pull in ngRoute and ngAnimate
var trueBlue = angular.module('trueBlue', ['ngRoute', 'ngAnimate']);

trueBlue.run(function($rootScope) {
  $rootScope.mainClass = null;
  $rootScope.navSection = null;
  $rootScope.stamps = 0;
  $rootScope.companyId = 3;
  $rootScope.username = "test";
  $rootScope.password = "test";
});

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
trueBlue.config(function($routeProvider) {
  $routeProvider
  	.when('/', {
  		templateUrl: 'Partials/login.html',
      controller: 'loginController'
  	})
  	.when('/offline', {
  		templateUrl: 'Partials/offline.html',
      controller: 'offlineController'
  	})
  	.when('/scan', {
  		templateUrl: 'Partials/scan.html',
      controller: 'scanController'
  	})
  	.when('/leaderboards', {
  		templateUrl: 'Partials/leaderboards.html',
      controller: 'leaderboardsController'
  	})
  	.when('/leaderboards/:leaderboardId', {
  		templateUrl: 'Partials/leaderboardList.html',
      controller: 'leaderboardListController'
  	})
  	.when('/rewards', {
  		templateUrl: 'Partials/rewards.html',
      controller: 'rewardsController'
  	})
  	.when('/products', {
  		templateUrl: 'Partials/products.html',
      controller: 'productsController'
  	})
  	.when('/products/:productCatId', {
  		templateUrl: 'Partials/productList.html',
      controller: 'productListController'
  	})
  	.when('/products/:productCatId/:productId', {
  		templateUrl: 'Partials/productInfo.html',
      controller: 'productInfoController'
  	})
  	.when('/locations', {
  		templateUrl: 'Partials/locations.html',
      controller: 'locationsController'
  	})
  	.when('/locations/:locationId', {
  		templateUrl: 'Partials/locationInfo.html',
      controller: 'locationInfoController'
  	})
    .otherwise({
        redirectTo: '/'
    });
});



trueBlue.service('LoyalService', ['$http', '$rootScope', function($http, $q, $rootScope) {

  this.updateCard = function() {
	//alert('updating card');
    console.log("Updating card...");
	
	try{
		$.ajax({
			url:'http://health.workplaymobile.com/badgeunit/api/getCard.json',
			type: 'post',
			//contentType: "application/json",
			success: function (data) {
				//alert(data);
				console.log(data);
				if (data.result){
					var num = data.profile.timesSeen;
					//alert(num);
					//$rootScope.stamps = num;
					if ($('#container').length) {
						while (num != Demo.getTotal()) {
							//alert(num);
							//alert(Demo);
						  Demo.addCircle();
						}
						$('.counter').html(num + "/10");
					}
				} else {
					alert('something went wrong');
				}
			},
			data: {
				company: 3,
				username: 'test',
				password: 'test'
			}
		});
	}catch(e){
		alert(e);
	}
   
  }
  
  this.tag = function(str) {
	var parent = this;
  	$.ajax({
  		url:'http://health.workplaymobile.com/badgeunit/api/push/notify.json',
  		type: 'post',
  		//contentType: "application/json",
  		success: function (data) {
  			console.log(data);
  			if (data.result){
  				parent.updateCard();
  			} else {
  				alert(data.msg);
  			}
  		},
  		data: {
  			company: str,
  			username: 'test',
  			password: 'test'
  		}
  	});
  }
  
  this.scan = function() {
	//alert('scan!!');
	  
    console.log('scanning');
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");
  
    scanner.scan( function (result) { 
      if (!result.cancelled){
      	this.tag(result.text);
      	window.plugins.toast.showLongCenter('Found BarCode: [' + result.format +'] ' + result.text, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
      }
    }, function (error) { 
      alert("Scanning failed: ", error); 
    });
  }
  
}]);

// CONTROLLERS ============================================

trueBlue.controller('loginController', function($scope, $rootScope, LoyalService) {
  $rootScope.mainClass = "splash";
  $scope.pageClass = 'page-login';
  
  $(document).ready(function(){
	//alert('FIRST LOAD');
  	//LoyalService.updateCard();
  });
  
  // login stuff
  // auto-login? device UIDs?
/*
  setTimeout(function() {
    window.location.href = "#scan";  
  }, 1500);
*/
});

trueBlue.controller('offlineController', function($scope, $rootScope) {
  $rootScope.mainClass = "splash";
  $scope.pageClass = 'page-offline';
});

trueBlue.controller('scanController', function($scope, $rootScope, LoyalService) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $scope.pageClass = 'page-scan';
  
  $(document).ready(function() {
	//alert('doc ready!');
  	
  	setTimeout(function() {
  		Demo.init();
  		//Demo.addCircle();
  		//Demo.addCircle();
  	  
  	}, 500);
  	
  	setTimeout(function() {
  		//Demo.addCircle();
  		//Demo.addCircle();
  		LoyalService.updateCard();
  	}, 1500);
    $('.innerCircle').bind("tap, click", function(e) {
      LoyalService.scan();
    });
    $('.counter').bind("tap, click", function(e) {
		  //alert('SCAN TIME2');
      //Demo.addCircle();
    });
  });
});

trueBlue.controller('leaderboardsController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $scope.pageClass = 'page-leaderboards';
});

trueBlue.controller('leaderboardListController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $scope.pageClass = 'page-leaderboards';
});

trueBlue.controller('rewardsController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "rewards";
  $scope.pageClass = 'page-rewards';
});

trueBlue.controller('productsController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $scope.pageClass = 'page-products';
});

trueBlue.controller('productListController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $scope.pageClass = 'page-products';
});

trueBlue.controller('productInfoController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $scope.pageClass = 'page-products';
});

trueBlue.controller('locationsController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "locations";
  $scope.pageClass = 'page-locations';
});

trueBlue.controller('locationInfoController', function($scope, $rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "locations";
  $scope.pageClass = 'page-locations';
});