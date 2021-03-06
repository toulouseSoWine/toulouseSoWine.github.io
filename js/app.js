'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Helvetica Light!

var app = angular.module('myApp',['ngMaterial','ngMessages','firebase','ngSanitize']);


app.controller("myCtrl",["$scope","$firebaseArray","$http","$window",
    function($scope,$firebaseArray,$http,$window){
    
    // Initialisation, Valorisation et Création de la table adhérents dans la base
    var url = 'https://toulouse-so-wine.firebaseio.com/adherents';
    var ref = new Firebase(url);
    $scope.users = $firebaseArray(ref);


    /////////////////////////////////////
    /////        MEETUP API         /////
    /////////////////////////////////////
    
   // MeetUp API url utiliser pour recevoir les données sous format JSON

    //Vous devez spécifier un paramètre de rappel dans votre URL qui sera 
    //le même que le nom de la fonction qui sera utilisée pour traiter les données renvoyées.
    var url = 'https://api.meetup.com/2/events?callback=apiCallback&sign=true&photo-host=public&group_urlname=ToulouseSoWine&page=20&key=271548165724ccf206a342412621';
   
    // Pour que le Callback fonctionne cette ligne est obligatoire
    var json = $http.jsonp(url);
    $scope.myEvent;
    
    // Callback pour le récuperation des données
    $window.apiCallback = function(json) {
	
        //$scope.lon = json.results[0].venue.lon;
        //$scope.lat = json.results[0].venue.lat;

        $scope.myEvent = json.results[0].description;
    };
        
  
	// JJ/MM/AAAA
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
          //console.log("Authenticated with uid:", authData.uid);
          
        } else {
          //console.log("Client unauthenticated.");
        }
    };
    
	// Vérifie si un utilisateur existe dans la base
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
                if(info.uid === uid){
                    if(info.password.email === mail &&
                    		provider === 'firebase'){
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

	// Vérifie si l'utilisateur est connecter ou non
    var status = function(){
	// On récupère les informations de l'utilisateur en ligne
        var auth = ref.getAuth();
		
		// Si il y'en a un
        if(auth){
            console.log(auth);
			// On vérifie si celui-ci est un adhérent
            adh(auth);
            //console.log("exist apres appel fonction "+ stats);
            ref.onAuth(cbAuth);
            // Désactivé inscription si vrai
            return true;
        }
        else{
            //console.log("Déconnecter "+auth);
            return false;
        }

    };
    
	// Création d'un nouvelle adhérent
	$scope.create = function(){
        ref.createUser({
            email    : $scope.email,
            password : $scope.password
            }, 
            function(error, userData) {
            	//console.log("data :", userData);
            if (error) 
            {
                //console.log("Error creating user:", error);
                ref.offAuth(cbAuth);
            } 
            else 
            {
                //console.log("Successfully created user account with uid:", userData);
                
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
                    email: $scope.email,
                    password : $scope.password,
                    niveau_de_connaissance : niveau || 'null',
                    preferences : typeVin || 'null',
                    connectWith : 'firebase'
                }); 
                
                ref.onAuth(cbAuth);
               
                $scope.loggedIn();
                status();
                document.location.reload(true);
            }
        });
    };
    console.log(status());
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
	
	// Déconnection
    $scope.logout  = function(){
        ref.offAuth(cbAuth);
        ref.unauth();
        document.location.reload(true);
        console.log('Déconnecter');
    };
    
    /////////////////////////////////////
    /////       FACBOOK LOGIN       /////
    /////////////////////////////////////

    
    $scope.login = function() {
        ref.authWithOAuthPopup("facebook", function(error, authData) {
		console.log(authData);
            //authData.facebook.id+' // '+authData.facebook.email);
          if (error) {
                console.log("Error logging user in:", error);
          } else {
                var typeVin = $scope.types_preferer;
                
				ref.$push({
					id: authData.uid,
					nom: authData.facebook.cachedUserProfile.last_name,
					prenom: authData.facebook.cachedUserProfile.first_name,
					email: authData.facebook.email,
					connectWith : 'facebook',
					dateDeNaissance: authData.facebook.cachedUserProfile.birthday,
					niveau_de_connaissance : $scope.niveau[0] || 'null',
					preferences : $scope.types_preferer || 'null'
				}); 
						
				ref.onAuth(cbAuth);
			   
				status();
				//document.location.reload(true);
				
               
          }
        }, {
          scope: "email,user_likes,public_profile,user_birthday,user_hometown,user_location,user_about_me" // the permissions requested
        });   
        
    };
	/*
    $scope.fbLogged = function(){
		
		var auth = ref.getAuth();

		var niveau = $scope.niveau[0];
		var typeVin = $scope.types_preferer;
		
		ref.once('value',function(snapshot){
			
			snapshot.forEach(function(snap){
			 	var mail = snap.child('email').val();
                var provider = snap.child('connectWith').val();
                var uid = snap.child('id').val();
                	
                if(auth.provider && provider === 'facebook'){
                    if(auth.facebook.email === mail && auth.uid === uid){
      				  
                    	
                    	//console.log(snap.child('email').val('salah.knk@gmail.com'));
                    	//console.log(snap.child('email').val());
                    }
                }
			});
		});
			
    };
	*/
 
    // Slide Modal Inscription   
    /*
    var modal = this;
    
    modal.steps = ['one', 'two'];
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
        	$scope.create();
        } else {
            modal.step += 1;
        }
    };
        */
    
    $scope.seConnecter = status();
    //console.log("se connecter status : "+$scope.seConnecter);
    
    // Informations sur les activité
    $scope.myActivity = [
        {   images: 'degustation1.jpg',
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
        /*{   images: 'Chateau JOLIET - Vin Rouge - Negrette.jpg',
            nom: 'Joliet'
        },
        {   images: 'cransac-blanc-renaiisance.jpg',
            nom: 'Cransac'
        },
        {   images: 'chateau_tarriquet.jpg',
            nom: 'Tariquet'
        }*/
    ];
    $http.get('partenaires.json').success(function(data){
    	var myArray = [];
		var obj = [];
    	for(var e = 0; e < data.partenaires.length; e++){
    		var pics = data.partenaires[e].images;
    		var name = data.partenaires[e].nom;
    		obj.push(data.partenaires[e]);
    		//myArray.push(name);
    		//myArray.push(pics);
    		myArray.push(obj[e]);
    	}
    	$scope.myPartenaire = data.partenaires;
    	//console.log(data);
        console.log($scope.myPartenaire);
    }).error(function(error){
    	console.log(error);
    });
	
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
        //console.log(idx);
        //console.log(item + ' // ' + list);
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
      //console.log(this.selectedCheckbox);
    };
    

	// Envoi d'email via API Mandrill
	$scope.sendMail = function(){
		var mailJSON ={
			"key": "aL2Sk6_lpO96reX3DxrgZA",
			"message": {
			  "html": ""+$scope.smailContent,
			  /*"text": ""+$scope.smailContent,*/
			  "from_email": $scope.smail,
			  "from_name": $scope.snom,
			  "to": [
				{
				  "email": "salah.knk@gmail.com",// ToulouseSoWine@gmail.com
				  "name": "ToulouseSoWine",
				  "type": "to"
				}
			  ],
			  "important": false,
			  "track_opens": null,
			  "track_clicks": null,
			  "auto_text": null,
			  "auto_html": null,
			  "inline_css": null,
			  "url_strip_qs": null,
			  "preserve_recipients": null,
			  "view_content_link": null,
			  "tracking_domain": null,
			  "signing_domain": null,
			  "return_path_domain": null
			},
			"async": false,
			"ip_pool": "Main Pool"
		};
		var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
		$http.post(apiURL, mailJSON).
		  success(function(data, status, headers, config) {
			alert('successful email send.');
			/*$scope.form={};
			console.log($scope.form);
			console.log('successful email send.');*/
			console.log('status: ' + status);
			/*console.log('data: ' + data);
			console.log('headers: ' + headers);
			console.log('config: ' + config);*/
			  $scope.smailContent = '';
			  $scope.smail = '';
			  $scope.snom = '';
		  }).error(function(data, status, headers, config) {
			console.log('error sending email.');
			console.log('status: ' + status);
		  });
	};
}]);
