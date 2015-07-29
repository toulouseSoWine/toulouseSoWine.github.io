'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('myApp',[]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['myApp']);
});

app.controller("myCtrl", function($scope){
    
    $scope.test = "angular cohabite avec firebase et bootsrap !!";

});