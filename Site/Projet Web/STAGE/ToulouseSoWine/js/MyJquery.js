/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    
    $('.myActivity').mouseenter(function(){
        $('.text-muted').css('color','#fff');
    });
    $('.myActivity').mouseleave(function(){
        $('.text-muted').css('color','#222');
    });
    $('.myContact').mouseenter(function(){
        $(this).css('background-color','rgba(182,1,79,0.6)');
        $('.text-muted').css('color','#fff');
    });
    $('.myContact').mouseleave(function(){
        $(this).css('background-color','rgb(182,1,79)');
    });

});
