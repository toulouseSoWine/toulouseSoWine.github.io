'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Helvetica Light!

var app = angular.module('myApp',['ngSanitize','ngMaterial','ngMessages','firebase']);

app.controller("myCtrl",["$scope","$firebaseArray","$http","$window",
    function($scope,$firebaseArray,$http,$window){
    
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['myApp']);
    });   
    
    // Informations sur les activité
    $scope.myActivity = [
        {   images: 'degustation.jpg',
            titre: 'Initiation à la dégustation', 
            description: 'Dégustation dans des lieux athipiques de la région toulousaine de 4 à 6 vins du Sud-Ouest.'
        },
        {   images: 'cepage.jpg',
            titre: 'Découverte des cépages', 
            description: 'Des moments sous le signe de la convivialité, pour découvrir les secrets aromatiques...'
        },
        {   images: 'accord.png',
            titre: 'Accord Mets & Vins', 
            description: 'Pour prolonger le plaisir de nos évènements avec vos amis, vous pouvez achetez à prix ...'
        }
    ];
    
    // Informations sur les partenaires
    $scope.myPartenaire = [
        {   images: 'Chateau JOLIET - Vin Rouge - Negrette.jpg',
            nom: 'Joliet'
        },
        {   images: 'cransac-blanc-renaiisance.jpg',
            nom: 'Cransac'
        },
        {   images: 'chateau_tarriquet.jpg',
            nom: 'Tariquet'
        }
    ];
    
    // Niveau de connaissance
    $scope.radioData = [
        { value: 'Néophite'},
        { value: 'Amateur'},
        { value: 'Passionné'},
        { value: 'Professionnel'}
       ];
    
    $scope.niveau = [];
    
    // Type de vins
    $scope.preference = [
        {images: 'BM.jpg', nom: 'Blanc Moelleux'},
        {images: 'BS.jpg', nom: 'Blanc Sec'},
        {images: 'ROS.jpg', nom: 'Rosé'},
        {images: 'RL.jpg', nom: 'Rouge Léger'},
        {images: 'RP.jpg', nom: 'Rouge Puissant'},
        {images: 'Eff.jpg', nom: 'Effervescent'}
    ];
    
    $scope.types_preferer = [];
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };
    
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    /*  
      $scope.test = function(){
        for(var i =0; i < $scope.selected.length; i++){
            var test = $scope.selected[i].nom;
            alert(test);
        }  
      };
    */
   
    $scope.selectedCheckbox = true;
    
    $scope.selected =function(){
      $scope.selectedCheckbox = !$scope.selectedCheckbox;
      console.log(this.selectedCheckbox);
    };
    
    var url = 'https://toulouse-so-wine.firebaseio.com/';
    // Instanciation de Firebase + url base de donnée
    var baseRef = new Firebase(url);
    // Table Adhérents
    var ref = new Firebase(url + 'adherents');
    // Objet tableau d'utilisateur auquel on passe le lien vers la base en argument 
    $scope.users = $firebaseArray(ref);
    // Fonction qui va créer notre utilisateur dans la base
    // On creer un nouvelle utilisateur est on récupere 
    // les informations associés 
    var addUsers = function(){
        ref.createUser({
            email    : $scope.email,
            password : $scope.password
            }, 
            function(error, userData) {
            if (error) 
            {
                console.log("Error creating user:", error);
                console.log("Error creation");
            } 
            else 
            {
                console.log("Successfully created user account with uid:", userData.uid);

                var niveau = $scope.niveau[0];
                var typeVin = $scope.types_preferer;
                var dateNaissance = formatDate($scope.dateN);

                // Si le compte se créer sans problème on enregistre les données dans la base
                $scope.users.$add({
                    id: userData.uid,
                    nom: $scope.nom,
                    prenom: $scope.prenom,
                    dateDeNaissance: dateNaissance,
                    ville: $scope.ville,
                    email:$scope.email,
                    password : $scope.password,
                    niveau_de_connaissance : niveau,
                    preferences : typeVin
                });                     
                
                
                
                document.location.reload(true);

                getStatus();
            }

        });
    };

    function formatDate(dn){
        var y = dn.getFullYear().toString();
        var m = dn.getMonth().toString();
        var d = dn.getDate().toString();
        
        var format = d + '/' + m + '/' + y;
        return format;
    }
    
    // Fonction qui va servir à authentifier un utilisateur
    $scope.userLogin = function(){
        //alert("fonction userLogin");
        ref.authWithPassword({
            email    : $scope.email,
            password : $scope.password
            }, 
                function(error, authData) {
                    if (error) // Si l'utilisateur n'existe pas une erreur est déclencher
                    {
                      console.log("Login Failed!", error);
                      //alert("Vous n'etes pas inscrit!");
                    } 
                    else // Sinon ce dernier est logger
                    {
                      console.log("Authenticated successfully with payload:", authData);
                      //alert("Succes login");
                      
                      document.location.reload(true);
                      
                      getStatus();                      
                    }
            }
        );
        
    };

    var getStatus = function(cbLoggedFB){
        // On essai de récuperer l'id du visiteur en ligne
        var authData = ref.getAuth();
        //console.log(authData.token);
        //console.log(authData);
        if (authData !== null) {
            
            console.log("Logged in as:", authData.uid);
            console.log(authData.provider);
            ref.once("value", function(snapshot){
                snapshot.forEach(function(snap){
                    // On vérifie que certain champs de notre table existe dans notre base 
                    // avant de certifié qu'un utilisateur est adhérent 
                    var uid = snap.child('id').val();
                    var fbtoken = snap.child('fbtoken').val();
                    
                    console.log(authData);
                    console.log(uid);
                    console.log(fbtoken);
                    if(authData.provider === 'facebook'){
                        if(authData.token === fbtoken){
                            ref.onAuth(cbAuth);
                            $scope.isVisible = false;
                            console.log("false"); 
                        }
                    }
                    else{
                        if (authData.uid === uid){
                            ref.onAuth(cbAuth);
                            $scope.isVisible = false;
                            console.log("false");
                        }
                    }
                });
            });

        } else {
            
            if(cbLoggedFB === true){
                $scope.isVisible = false; 
                document.location.reload(true);
            }
            else{
                
                $scope.completeInfo = false;
                //console.log("Logged out");
                $scope.isVisible = true; 
            }
        }
        
    };
    
    getStatus();
    
    var cbAuth = (function(authData) {
        if (authData) {
          console.log("Authenticated with uid:", authData.uid);
        } else {
          console.log("Client unauthenticated.");
          $scope.isVisible = true;
        }
      });

    $scope.logout = function(){
        ref.offAuth(cbAuth);
        document.location.reload(true);
        ref.unauth();
        getStatus();
        console.log('Déconnecter');
    };
    
    $scope.valid = function (){
        var authData = ref.getAuth();
        if(authData.provider === 'facebook'){
            console.log('facebook');
            var niveau = $scope.niveau[0];
            var typeVin = $scope.types_preferer;
            var dateNaissance = formatDate($scope.dateN);
            // Si le compte se créer sans problème on enregistre les données dans la base
            $scope.users.$add({
                id: authData.uid,
                nom: $scope.nom,
                prenom: $scope.prenom,
                dateDeNaissance: dateNaissance,
                ville: $scope.ville,
                email:$scope.email,
                password : $scope.password,
                niveau_de_connaissance : niveau,
                preferences : typeVin,
                fbToken : authData.token
            });    
            document.location.reload(true);
        }
        else{
            console.log('addUser()');
            addUsers();
        }
    };
    /////////////////////////////////////
    /////       FACBOOK LOGIN       /////
    /////////////////////////////////////
    /*
    // Initialisation de l'API
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '788769794573763',
        status     : true,
        cookie     : true,
        xfbml      : true,
        oauth      : true,
        version    : 'v2.4'
      });
    };
    
    // Chargement du SDK asynchrone
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/fr_FR/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
    */
    ////////////////////////////////////////
  
    
    $scope.login = function(cbLoggedFB) {
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            //authData.facebook.id+' // '+authData.facebook.email);
            
          $scope.completeInfo = true;            
          if (error) {
                console.log("Login Failed!", error);
                cbLoggedFB = false;
                $scope.completeInfo = cbLoggedFB;
                
          } else {
              //alert(authData.facebook.cachedUserProfile.last_name);
                // the access token will allow us to make Open Graph API calls
                console.log(authData.facebook.accessToken); 
                
                //cbLoggedFB = true;
                
                $scope.FBnom = authData.facebook.cachedUserProfile.last_name;
                $scope.FBprenom = authData.facebook.cachedUserProfile.first_name;
                
                $scope.prenom = $scope.FBprenom;
                $scope.nom = $scope.FBnom;
                $scope.email = authData.facebook.email;
               
          }
        }, {
          scope: "email,user_likes,public_profile" // the permissions requested
        });   
        
    };


    /////////////////////////////////////
    /////        MEETUP API         /////
    /////////////////////////////////////
    
   // MeetUp API url utiliser pour recevoir les données sous format JSON

    //Vous devez spécifier un paramètre de rappel dans votre URL qui sera 
    //le même que le nom de la fonction qui sera utilisée pour traiter les données renvoyées.
   var url = 
            'https://api.meetup.com/2/events?callback=apiCallback&sign=true&photo-host=public&group_urlname=ToulouseSoWine&page=20&key=271548165724ccf206a342412621';
   
    // Pour que le Callback fonctionne cette ligne est obligatoire
    var parse = $http.jsonp(url);
    
    //console.log(angular.fromJson(test));

    // Callback pour le récuperation des données
    $window.apiCallback = function(data) {
        console.log(data.results[0]); 
    };

}]);

