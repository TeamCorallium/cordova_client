var module = angular.module('appAngular', ['onsen']);

module.controller('AppController', function($scope, $http, MyTimer, $timeout, sharedProperties) {
    $scope.timerCounter = MyTimer(1000);

    $scope.getBackEndURI = function() {
        return sharedProperties.getBackEndURI();
    }
    $scope.setBackEndURI = function(r) {
        sharedProperties.setBackEndURI(r);
    }

    $scope.httpConnection;
    $scope.onCheckbox = function(value, id){
        $scope.getData(value, id); 
    } 
    $scope.getData = function(value, id) {
        modal.show();
        var url = 'http://192.168.4.1/on?id=' + id;
        if(value == false) {
            url = 'http://192.168.4.1/off?id=' + id;
        }
//        var resource = 'profiles/' + sharedProperties.getPetIDNumber() + '.json';
        $http({method : 'GET', url : url})
            .success(function(data, status) {
            $scope.httpConnection = 'Connection OK';
//                $scope.items = data;
//                $scope.httpTest = 'ok ok';
//                $scope.connectionError = false;
//                
//                sharedProperties.setPetName($scope.items.first_name);
//                sharedProperties.setPetLastName($scope.items.last_name);
//                sharedProperties.setPetPicture($scope.items.picture);
//
//                $scope.disabledNextButton = false;
                modal.hide();
            })
            .error(function(data, status) {
                $scope.httpConnection = 'Connection ERROR';
//            	$scope.connectionError = true;
//            	if (status == 404) 
//            		$scope.connectionStatus = 'not-found';
//            	else
//            		$scope.connectionStatus = 'error';
            	
            	modal.hide();
            });
    } 
});

module.controller('Page0Controller', function($scope, sharedProperties) {
    $scope.checked;
    $scope.onCheckbox = function(){
        console.log($scope.checked);
    }
});

module.controller('SettingController', function($scope, sharedProperties) {
    $scope.textURI = sharedProperties.getBackEndURI();
});


module.factory('MyTimer', function($interval) {
    return function(delay){
        var initialMs= (new Date()).getTime();
        var result = {totalMilliseconds:0, counts:0};
        $interval(function() {
            result.totalMilliseconds = (new Date()).getTime() - initialMs;
            result.counts++;
            }, delay);
        return result;
    };
});

  module.service('sharedProperties', function ($window) {
    var reason = "";
    var isAppointment = true;
    var appointmentTime = "";
    var petIDNumber = "";
    var petName = "";
    var petLastName = "";
    var pictureUri = "";
    var backEndURI = "http://10.1.10.61:8000/api/v1/{resource}?apiKey=blueberryapi";
    var manualTimeInput = false;
    var doctor = "";
    
    return {
        getNextPage: function() {
           if(isAppointment){
                return "pageSelectDoctor.html";
           }else {
                return "pageSelectDoctor.html";
           }
        },
        getIsAppointment: function() {
            return isAppointment;
        },
        setIsAppointment: function(is) {
            isAppointment = is;
        },
        getReason: function() {
            return reason;
        },
        setReason: function(r) {
            reason = r;
        },
        getDoctor: function() {
            return doctor;
        },
        setDoctor: function(dr) {
            doctor = dr;
        },
        getAppointmentTime: function() {
            return appointmentTime;
        },
        setAppointmentTime: function(t) {
            appointmentTime = t;
        },
        getPetIDNumber: function() {
           return petIDNumber;
        },
        setPetIDNumber: function(n) {
           petIDNumber = n;
        },
        getPetName: function() {
           return petName;
        },
        setPetName: function(n) {
           petName = n;
        },
        getPetLastName: function() {
           return petLastName;
        },
        setPetLastName: function(n) {
           petLastName = n;
        },
        getPetPicture: function() {
           return pictureUri;
        },
        setPetPicture: function(p) {
           pictureUri = p;
        },
        getBackEndURI: function() {
           //return backEndURI;
           return ($window.localStorage && $window.localStorage.getItem('backEndURI')) || backEndURI;
        },
        setBackEndURI: function(b) {
           //backEndURI = b;
           $window.localStorage && $window.localStorage.setItem('backEndURI', b);
        },
        formatTime: function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        },
        formatTime2: function(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+ minutes : minutes;
            var strTime = new Array(hours + ':' + minutes, ampm);
            return strTime;
        },
        reset: function() {
            reason = "";
            isAppointment = true;
            appointmentTime = "";
            petIDNumber = "";
            petName = "";
            petLastName = "";
            pictureUri = "";
            manualTimeInput = false;
            doctor = "";
        },
        setManualTimeInput: function(input) {
        	manualTimeInput = input;
        },
        isManualTimeInput: function() {
        	return manualTimeInput === true;
        }
    };
});

  
