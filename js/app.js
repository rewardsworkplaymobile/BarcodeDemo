// define our application and pull in ngRoute and ngAnimate
var trueBlue = angular.module('trueBlue', ['ngRoute', 'ngAnimate']);

trueBlue.run(function($rootScope, LoyalService) {
  $rootScope.mainClass = null;
  $rootScope.navSection = null;
  $rootScope.stamps = 0;
  $rootScope.companyId = 3;
  $rootScope.username = "test";
  $rootScope.password = "test";
  $rootScope.profileData = null;
  $rootScope.availPrizes = 0;
  $rootScope.redeemedPrizes = 0;
  $rootScope.messageTitle = "";
  $rootScope.messageContent = "";

  if (!$rootScope.profileData && $rootScope.companyId && $rootScope.username && $rootScope.password) {
  	LoyalService.updateCard($rootScope.companyId,$rootScope.username,$rootScope.password);
  }
  
  $rootScope.getNumber = function(num) {
    return new Array(num);   
  }
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
  	.when('/rewards/:rewardId', {
  		templateUrl: 'Partials/redeemReward.html',
      controller: 'redeemRewardController'
  	})
  	.when('/message', {
  		templateUrl: 'Partials/message.html',
      controller: 'messageController'
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



trueBlue.service('LoyalService', ['$rootScope', function($rootScope) {
  var $this = this;
  
  this.updateCard = function(cid,user,pass) {
    console.log("Updating card...");
  
    $.ajax({
  		url:'http://health.workplaymobile.com/badgeunit/api/getCard.json',
  		type: 'post',
  		//contentType: "application/json",
  		success: function (data) {
  			console.log(data);
  			if (data.result){
  			  $rootScope.profileData = data.profile;
  				$rootScope.availPrizes = $rootScope.profileData.rewardsEarned;
  				$rootScope.redeemedPrizes = $rootScope.profileData.rewardsRedeemed;
  				
  				var num = $rootScope.profileData.timesSeen;
  				$rootScope.stamps = num;
          $rootScope.$apply();
          
  				if ($('#container').length) {
  				  var $upto = $('#container .stamp').eq(num);
  				  if (num < $('#container .stamp').length) {
  				    $upto.prevAll().removeClass('empty');
  				  }
  				  //game.loadUpTheCircles(num-game.getTotal);
  				}
  			} else {
  				bootbox.alert("Something went wrong...", function() {});
  			}
  		},
  		data: {
  			company: cid,
  			username: user,
  			password: pass
  		}
  	});
   
  };
  
  this.tag = function(str,cid,user,pass) {
    //alert("TAG!");
  	$.ajax({
  		url:'http://health.workplaymobile.com/badgeunit/api/push/notify.json',
  		type: 'post',
  		//contentType: "application/json",
  		success: function (data) {
  			console.log(data);
  			if (data.result){
  				var num = $rootScope.profileData.timesSeen + 1;
  				if (num >= $('#container .stamp').length) {
    			  $('#container .stamp').removeClass('empty');
    			  
/*
            $("#container .stamp").each(function() {
              $(this).animate({
                left: "50%",
                top: "50%",
        			  height: "100%",
        			  width: "100%",
                opacity: 0,
                marginTop: 0,
                marginLeft: 0
              }, 1000);
            });
*/
    			  $('#container').animateRotate(360, 1000, 'linear', function() {
    			    $("#container").removeAttr('style');
/*
              $("#container .stamp").each(function() {
                $(this).removeAttr('style');
              });
*/
      			  $('#container .stamp').addClass('empty');
      			  
    			    var newRewardDiv = $('<a href="#rewards" class="reward claim" type="stamp" style="opacity: 0; top: -40px;">Claim your reward!<div class="arrow right white"></div></a>');
    			    $('.rewards').prepend(newRewardDiv);
    			    setTimeout(function() {
    			      newRewardDiv.removeAttr('style');
    			    }, 100);
    			  });
  			  }
  				$this.updateCard($rootScope.companyId,$rootScope.username,$rootScope.password);
  			} else {
  				//alert(data.msg);
        	window.plugins.toast.showLongCenter(data.msg, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
  			}
  		},
  		data: {
  			company: cid,
  			username: user,
  			password: pass
  		}
  	});
  };
  
  this.redeem = function(code,cid,user,pass) {
  	$.ajax({
  		url:'http://health.workplaymobile.com/badgeunit/api/push/notify.json',
  		type: 'post',
  		//contentType: "application/json",
  		success: function (data) {
  			console.log(data);
  			if (data.result){
  				$rootScope.messageTitle = "Thank you!";
  				$rootScope.messageContent = "Your reward has been redeemed!";
          window.location.href = "#message";
  			} else {
        	window.plugins.toast.showLongCenter(data.msg, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
  			}
  		},
  		data: {
  			company: cid,
  			username: user,
  			password: pass,
  			redeem: code
  		}
  	});
  };
  
  this.scan = function() {
    console.log('scanning');
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");
  
    scanner.scan( function (result) {
      //alert(result + " = " + result.cancelled + " = " + result.text + " = " + $rootScope.companyId);
      if (!result.cancelled){
        if (result.text != $rootScope.companyId) {
        	window.plugins.toast.showLongCenter('BarCode does not correspond to specified Company ID', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
        } else {
          //alert("should tag. " + result.text + " " + $rootScope.companyId + " " + $rootScope.username + " " + $rootScope.password);
        	$this.tag(result.text,$rootScope.companyId,$rootScope.username,$rootScope.password);
        	window.plugins.toast.showLongCenter("You've earned a stamp!", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
        }
      }
    }, function (error) { 
      alert("Scanning failed: ", error); 
    });
  };
  
}]);

// CONTROLLERS ============================================

trueBlue.controller('loginController', function($rootScope, LoyalService) {
  $rootScope.mainClass = "splash";
  $rootScope.pageClass = 'page-login';
  
  $(document).ready(function(){
  	LoyalService.updateCard($rootScope.companyId,$rootScope.username,$rootScope.password);
  });
  
  // login stuff
  // auto-login? device UIDs?
/*
  setTimeout(function() {
    window.location.href = "#scan";  
  }, 1500);
*/
});

trueBlue.controller('offlineController', function($rootScope) {
  $rootScope.mainClass = "splash";
  $rootScope.pageClass = 'page-offline';
});

trueBlue.controller('scanController', function($rootScope, LoyalService) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $rootScope.pageClass = 'page-scan';
  
  $(document).ready(function() {
  	LoyalService.updateCard($rootScope.companyId,$rootScope.username,$rootScope.password);
  	
  	setTimeout(function() {
/*
  	  $("#container .stamp").each(function() {
        var $this = $(this);
        $.data(this, 'css', { left: $this.css('left'),
                              top: $this.css('top'),
                              height: $this.css('height'),
                              width: $this.css('width'),
                              opacity: $this.css('opacity'),
                              marginTop: $this.css('marginTop'),
                              marginLeft: $this.css('marginLeft') });
      });
*/
  	}, 500);
    $('.innerCircle').bind("tap, click", function(e) {
      //Demo.addCircle();
      LoyalService.scan();
    });
    
//    $('.counter').bind("tap, click", function(e) {
//      LoyalService.tag(3,$rootScope.companyId, $rootScope.username, $rootScope.password);
/*
      $rootScope.stamps++;
      console.log("STAMPS", $rootScope.stamps);
      $rootScope.$apply();
			if ($('#container').length) {
			  var $upto = $('#container .stamp').eq($rootScope.stamps);
			  $upto.prevAll().removeClass('empty');
  		  if ($rootScope.stamps >= $('#container .stamp').length) {
  			  $('#container .stamp').removeClass('empty');
  			  //$('#container').addClass('complete');
  			  
          $("#container .stamp").each(function() {
            $(this).animate({
              left: "50%",
              top: "50%",
      			  height: "100%",
      			  width: "100%",
              opacity: 0,
              marginTop: 0,
              marginLeft: 0
            }, 1000);
          });
  			  $('#container').animateRotate(360, 1000, 'linear', function() {
  			    $("#container").removeAttr('style');
            $("#container .stamp").each(function() {
              $(this).removeAttr('style');
            });
    			  $('#container .stamp').addClass('empty');
    			  
    				$rootScope.stamps = 0;
            $rootScope.$apply();
            
  			    var newRewardDiv = $('<a href="#rewards" class="reward claim" type="stamp" style="opacity: 0; top: -40px;">Claim your reward!<div class="arrow right white"></div></a>');
  			    $('.rewards').prepend(newRewardDiv);
  			    setTimeout(function() {
  			      newRewardDiv.removeAttr('style');
  			    }, 100);
  			  });
  		  } else {
  		    $upto.prevAll().removeClass('empty');
  		  }
			}
*/
//    });
  });
});

trueBlue.controller('leaderboardsController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $rootScope.pageClass = 'page-leaderboards';
});

trueBlue.controller('leaderboardListController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "scan";
  $rootScope.pageClass = 'page-leaderboards';
});

trueBlue.controller('rewardsController', function($rootScope, LoyalService) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "rewards";
  $rootScope.pageClass = 'page-rewards';
});

trueBlue.controller('redeemRewardController', function($rootScope, LoyalService) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "rewards";
  $rootScope.pageClass = 'page-rewards';
  
  $('form#redeemBox').submit(function() {
    var code = $('input[name=passcode]').val();
    LoyalService.redeem(code,$rootScope.companyId,$rootScope.username,$rootScope.password);
  });
});

trueBlue.controller('messageController', function($rootScope) {
  $rootScope.mainClass = "inner";
  
  setTimeout(function() {
    window.location.href = "#scan";
    $rootScope.messageTitle = "";
    $rootScope.messageContent = "";
  }, 3500);
});

trueBlue.controller('productsController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $rootScope.pageClass = 'page-products';
});

trueBlue.controller('productListController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $rootScope.pageClass = 'page-products';
});

trueBlue.controller('productInfoController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "products";
  $rootScope.pageClass = 'page-products';
});

trueBlue.controller('locationsController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "locations";
  $rootScope.pageClass = 'page-locations';
});

trueBlue.controller('locationInfoController', function($rootScope) {
  $rootScope.mainClass = "inner";
  $rootScope.navSection = "locations";
  $rootScope.pageClass = 'page-locations';
});

/*
$.fn.animateRotate = function(angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function(i, e) {
        args.step = function(now) {
            $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(this, arguments);
        };

        $({deg: 0}).animate({deg: angle}, args);
    });
};
*/