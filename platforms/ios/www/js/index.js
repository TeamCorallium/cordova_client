/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var keyboardIsVisible = false;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        keepscreenon.enable();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    scanQRCode: function() {
    	//qr code reader.
    	var urlLbl = document.getElementById("urlLbl");
    	urlLbl.innerHTML = "scanning...";
    	
        var params = {
            text_title: 'Scan QR Code', // Android only
            text_instructions: 'Please point your camera at the QR code.', // Android only
            camera: "back", // defaults to "back", option "front"
            flash: "auto" // defaults to "auto". See Quirks  || "on" || "off" 
        };
        
        cloudSky.zBar.scan(params, onSuccess=function(s){
        	alert('success: ' + s);
        	var urlLbl = document.getElementById("urlLbl");
        	urlLbl.innerHTML = s;
        }, 
        onFailure=function(s){
        	if (s == 'canceled'){
        		alert ('user cancelled!');
        	}
        	else {
        		alert ('failure: ' + s);
        	}
        	
        	urlLbl.innerHTML = s;
        });
    }
};

app.initialize();








//----

var idleTime = 0;
var idleMaxTime = 60;
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 1000); // 1 seg

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > idleMaxTime) { // 1min
    	idleTime=0;
    	//alert('In timer increment method.')
    	 var scope = angular.element($("#BodyID")).scope();
    	 scope.onUserIdle();
    }
}
