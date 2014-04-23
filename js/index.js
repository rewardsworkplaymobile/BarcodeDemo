$(document).ready(function(){
	updateCard();
	
});

function updateCard(){
	$.ajax({
		url:'http://health.workplaymobile.com/badgeunit/api/getCard.json',
		type: 'post',
		//contentType: "application/json",
		success: function (data) {
			console.log(data);
			if (data.result){
				var num = data.profile.timesSeen;
				
				$("td").each(function() {
					if (num-- > 0){
						$(this).css('background-color', 'green');
					}else{
						$(this).css('background-color', '');
					}
				});
				
			}else{
				bootbox.alert("Something went wrong...", function() {});
			}
		},
		data: {
			company: 3,
			username: 'test',
			password: 'test'
		}
	});
}

function tag(str){
	alert(str);
	$.ajax({
		url:'http://health.workplaymobile.com/badgeunit/api/push/notify.json',
		type: 'post',
		//contentType: "application/json",
		success: function (data) {
			console.log(data);
			if (data.result){
				updateCard();
			}else{
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


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        //document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
		
		window.plugins.toast.showLongCenter('System Initialzed and Ready To Go!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
		
    },

    scan: function() {
        console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan( function (result) { 

			if (!result.cancelled){
				window.plugins.toast.showLongCenter('Found BarCode: [' + result.format +'] ' + result.text, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)})
			}
            
            if (args.format == "QR_CODE") {
				tag(args.text);
                //window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            

        }, function (error) { 
			alert("Scanning failed: ", error); 
        } );
    },

    encode: function() {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
		
		var encodeText=prompt("Please enter what you want to encode","TEXT");
		
        scanner.encode(scanner.Encode.TEXT_TYPE, encodeText, function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );

    }

};
