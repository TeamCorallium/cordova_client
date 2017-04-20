var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
};

app.initialize();

var app = angular.module('myApp', ['onsen']);

app.controller('MainController', function ($scope, $http){
        
    $scope.itemsArray = [];
    $scope.filterEnable = true;
    $scope.httpConnection = 'ok';

    activate();

    ////////////////
    function activate() {
        getConfig();  
    }

    $scope.myFilter = function (value) { 
        return value === '1';
    };

    $scope.onCheckbox = function(value, id) {
        var intId = Number(id) + 1;
        $scope.getData(value, intId); 
    } 

    $scope.getData = function(value, id) {
        var modal = document.getElementById('modal');
        modal.show();

        var url = 'http://192.168.4.1/on?id=' + id;
        if(value == false) {
            url = 'http://192.168.4.1/off?id=' + id;
        }

        $http.get(url)
            .then(function onSuccess(response) {
                $scope.httpConnection = 'Connection OK';
                modal.hide();
            })
            .catch(function onError(response) {
                modal.hide();
                ons.notification.alert('Connection error!!! Check your wifi config and try again...'); 
                $scope.itemsArray = [];
            });
    } 

    $scope.getDeviceConfig = function() {
        getConfig();
    }

    $scope.updateDeviceConfig = function() {
        updateConfig();
    }    

    function getConfig() {
        $scope.itemsArray = [];
        var modal = document.getElementById('modal');
        modal.show();

        $http.get('http://192.168.4.1/get_config')
            .then(function onSuccess(response) {
                $scope.httpConnection = response.data;
                var data = response.data;
                var listData = data.split(':');
                for (i = 0; i < listData.length; i++) { 
                    var itemValues = listData[i].split(',');
                    if(itemValues.length == 3) {
                        var item = {};
                        item.icon = 'img/inconLuz.jpg';
                        item.id = itemValues[0];
                        item.desc = itemValues[1];
                        // item.pin = itemValues[2];
                        item.enable = itemValues[2] == '1';
                        $scope.itemsArray.push(item);
                    }
                }
                modal.hide();
            })
            .catch(function onError(response) {
                ons.notification.alert('Connection error!!! Check your wifi config and try again...'); 
                modal.hide();
            });
    }

    function updateConfig() {
        var parameters = 'count=' + $scope.itemsArray.length+'&';

        for (i = 0; i < $scope.itemsArray.length; i++) { 
            parameters += 'id'+ i + '=' + $scope.itemsArray[i].id +'&';
            parameters += 'desc'+ i + '=' + $scope.itemsArray[i].desc +'&';
            parameters += 'enable'+ i + '=' + $scope.itemsArray[i].enable;

            if (i != $scope.itemsArray.length - 1) {
                parameters += '&';
            }
        }

        var modal = document.getElementById('modal');
        modal.show();

        $http.get('http://192.168.4.1/update_config?' + parameters)
            .then(function onSuccess(response) {
                modal.hide();
                ons.notification.alert('Successful config update'); 
                mynavg.popPage();
            })
            .catch(function onError(response) {
                ons.notification.alert('Connection error!!! Check your wifi config and try again...'); 
                mynavg.popPage();
                modal.hide();
            });       
    }

    $scope.load = function(page) {
      mySplitter.content.load(page)
        .then(function() {
          mySplitter.left.close();
        });
    };

    var mynavg = document.querySelector("#mynav");  

    $scope.showAbout = function () {
        ons.notification.alert({
            title: 'About us',
            message: 'Development by the Embedded Systems Team...'
        }); 
    }

    $scope.gotoSettings = function () {
        mynavg.pushPage("settings.html");
    };

    $scope.gotoHelp = function () {
        mynavg.pushPage("help.html");
    };

    $scope.gotoContent = function (id) {
        mynavg.pushPage("content"+id+".html");
    }
});


