'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Helvetica Light!

var app = angular.module('myApp',['ngMaterial','ngMessages','firebase','ngSanitize']);//


app.controller("myCtrl",["$scope","$firebaseArray","$http","$window",
    function($scope,$firebaseArray,$http,$window){
    
    // Initialisation, Valorisation et Creéation de la table adhérents dans la base
    var url = 'https://toulouse-so-wine.firebaseio.com/adherents';
    var ref = new Firebase(url);
    $scope.users = $firebaseArray(ref);
  
    function formatDate(dn){
    	dn = new Date();
        var y = dn.getFullYear().toString();
        var m = dn.getMonth().toString();
        var d = dn.getDate().toString();
        
        var format = d + '/' + m + '/' + y;
        return format;
    }
    

    var cbAuth = function(authData) {
        if (authData) {
          console.log("Authenticated with uid:", authData.uid);
          
        } else {
          console.log("Client unauthenticated.");
          ref.offAuth();
        }
    };
    
    var url = 'https://toulouse-so-wine.firebaseio.com/adherents';
    var ref = new Firebase(url);

    var adh = function(info){

        ref.once('value',function(snapshot){

            snapshot.forEach(function(snap){
                var mail = snap.child('email').val();
                var provider = snap.child('connectWith').val();
                var uid = snap.child('id').val();

                //console.log("mon provdier : "+ info.provider + ' ' + provider);
                //console.log("mon mail : "+info.password.email + ' ' + mail);
                //console.log("mon id : "+ info.uid + ' ' + uid);
                if(info.provider === 'facebook'){
                    if(info.facebook.email === mail && info.uid === uid){
                        //ref.onAuth(cbAuth);
                        //alert('true');
                        return true;
                    }
                }
                if(info.provider === 'password'){
                    if(info.password.email === mail && 
                            info.uid === uid && provider === 'firebase'){
                        //ref.onAuth(cbAuth);
                        return true;
                    }
                }
                else{
                    //alert('false');
                    return false;
                }
            });
        });
    };

    var status = function(){
        var auth = ref.getAuth();

        if(auth){
            console.log(auth);
            var stats = adh(auth);
            if(stats === true){
                console.log('L\'utilisateur existe dans la base' );
            }
            console.log("exist apres appel fonction "+ stats);
            ref.onAuth(cbAuth);
            //hoteProvider = auth.provider;
            // Desactivé inscription si vrai
            return true;
        }
        else{
            console.log("Déconnecter "+auth);
            return false;
        }

    };


    $scope.create = function(){
        ref.createUser({
            email    : $scope.email,
            password : $scope.password
            }, 
            function(error, userData) {
        console.log("data :", userData);
            if (error) 
            {
                console.log("Error creating user:", error);
                ref.offAuth(cbAuth);
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
                    preferences : typeVin,
                    connectWith : 'firebase'
                }); 
                
                ref.onAuth(cbAuth);
               
                status();
                 document.location.reload(true);
            }
        });
    };
   
    // Fonction qui va servir à authentifier un utilisateur
    $scope.loggedIn = function(){

        var logged = false;

        ref.authWithPassword({
            email    : $scope.email,
            password : $scope.password
            }, 
            function(error, authData) {
                if (error) // Si l'utilisateur n'existe pas une erreur est déclencher
                {
                  console.log("Login Failed!", error);
                  ref.offAuth(cbAuth);

                } 
                else // Sinon ce dernier est logger
                {
                  console.log("Authenticated successfully with payload:", authData);
                  //alert("Succes login");
                  logged = true;
                  ref.onAuth(cbAuth);
                  
                  status();
                  document.location.reload(true);
                }
            }
        );

        return logged;
    };

    $scope.logout  = function(){
        ref.offAuth(cbAuth);
        ref.unauth();
        document.location.reload(true);
        getStatus();
        console.log('Déconnecter');
    };
    
    /////////////////////////////////////
    /////       FACBOOK LOGIN       /////
    /////////////////////////////////////

    $scope.cbLogin = false;
    
    $scope.login = function() {
        ref.authWithOAuthPopup("facebook", function(error, authData) {
            //authData.facebook.id+' // '+authData.facebook.email);
        	
          if (error) {
                console.log("Login Failed!", error);
          } else {
              //alert(authData.facebook.cachedUserProfile.last_name);
                // the access token will allow us to make Open Graph API calls
                console.log(authData); 
                
                
                $scope.FBnom = authData.facebook.cachedUserProfile.last_name;
                $scope.FBprenom = authData.facebook.cachedUserProfile.first_name;
                
                $scope.prenom = $scope.FBprenom;
                $scope.nom = $scope.FBnom;
                $scope.email = authData.facebook.email;
               
          }
        }, {
          scope: "email,user_likes,public_profile" // the permissions requested
        });   
        
        $scope.cbLogin = true;
        $scope.setCurrentStep(2);
    };

    $scope.fbLogged = function(){
    	ref.authWithCustomToken('AUTH_TOKEN', function(authData){
			var niveau = $scope.niveau[0];
			var typeVin = $scope.types_preferer;
			var dateNaissance = formatDate($scope.dateN);
			    
			$scope.users.$add({
			    id: authData.uid,
			    nom: $scope.nom,
			    prenom: $scope.prenom,
			    dateDeNaissance: dateNaissance,
			    ville: $scope.ville,
			    email: $scope.email,
			    niveau_de_connaissance : niveau,
			    preferences : typeVin,
			    connectWith : 'facebook'
			}); 
		
    });
    }
    // Slide Modal Inscription
    
    var modal = this;

    modal.steps = ['one', 'two', 'three','four'];
    modal.step = 0;

    $scope.isFirstStep = function () {
        return modal.step === 0;
    };

    $scope.isLastStep = function () {
        return modal.step === (modal.steps.length - 1);
    };

    $scope.isCurrentStep = function (step) {
        return modal.step === step;
    };

    $scope.setCurrentStep = function (step) {
        modal.step = step;
    };

    $scope.getCurrentStep = function (){ 
        return modal.steps[modal.step];
    };

    $scope.getNextLabel = function () {
        return ($scope.isLastStep()) ? 'Valider' : 'Suivant';
    };

    $scope.handlePrevious = function () {
        modal.step -= ($scope.isFirstStep()) ? 0 : 1;
    };

    $scope.handleNext = function () {
        if ($scope.isLastStep()) {
        } else {
            modal.step += 1;
        }
    };

    $scope.dismiss = function(reason) {
        $modalInstance.dismiss(reason);
    };
    
    
    $scope.seConnecter = status();
    console.log("se connecter status : "+$scope.seConnecter);
    
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
    

    /////////////////////////////////////
    /////        MEETUP API         /////
    /////////////////////////////////////
    
   // MeetUp API url utiliser pour recevoir les données sous format JSON

    //Vous devez spécifier un paramètre de rappel dans votre URL qui sera 
    //le même que le nom de la fonction qui sera utilisée pour traiter les données renvoyées.
    var url = 
            'https://api.meetup.com/2/events?callback=apiCallback&sign=true&photo-host=public&group_urlname=ToulouseSoWine&page=20&key=271548165724ccf206a342412621';
   
    // Pour que le Callback fonctionne cette ligne est obligatoire
    var json = $http.jsonp(url);
    $scope.myEvent;
    //console.log(angular.fromJson(test));
    
    // Callback pour le récuperation des données
    $window.apiCallback = function(json) {
        console.log(json.results);
        $scope.myEvent = json.results[0].description;
    };
    /*
    // Callback pour le récuperation des données
    $window.apiCallback = function(data) {
        console.log(data.results[0].description);
        $scope.myEvent = data.results[0].description;
    };*/

}]);
