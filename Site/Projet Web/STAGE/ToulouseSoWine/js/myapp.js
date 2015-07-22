'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('appTsw',[]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['appTsw']);
});

app.controller("Ctrl", function($scope){
    $scope.hello = "Enfin sa marche !";
 
    $scope.liste = [
            {photo:'img/about/1.jpg',date:'2009-2011',titre:'Our Humble Beginnings',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!'},
            {photo:'img/about/2.jpg',date:'March 2011',titre:'An Agency is Born',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!'},
            {photo:'img/about/3.jpg',date:'December 2012',titre:'Phase Two Expansion',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!'},
            {photo:'img/about/4.jpg',date:'July 2014',titre:'Transition to Full Service',description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt ut voluptatum eius sapiente, totam reiciendis temporibus qui quibusdam, recusandae sit vero unde, sed, incidunt et ea quo dolore laudantium consectetur!'}
        ];    
        
});
