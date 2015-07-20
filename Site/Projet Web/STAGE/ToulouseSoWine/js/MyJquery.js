/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){

    $('.myContact').mouseenter(function(){
        $(this).css('background-color','rgb(250,205,105)');
    });
    $('.myContact').mouseleave(function(){
        $(this).css('background-color','rgba(250,205,105,0.5)');
    });

});
