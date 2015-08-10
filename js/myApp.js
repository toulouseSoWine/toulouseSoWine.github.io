'use strict';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Helvetica Light!

var app = angular.module('myApp',['ngMaterial','ngMessages','firebase']);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['myApp']);
});


app.controller("myCtrl",["$scope","$firebaseArray", "$firebaseAuth",
    function($scope,$firebaseArray,$firebaseAuth,$http){
    
    // Informations sur les activité
    $scope.myActivity = [
        {images: 'degustation.jpg',
            titre: 'Initiation à la dégustation', 
            description: 'Dégustation dans des lieux athipiques de la région toulousaine de 4 à 6 vins du Sud-Ouest.'},
        {images: 'cepage.jpg',
            titre: 'Découverte des cépages', 
            description: 'Des moments sous le signe de la convivialité, pour découvrir les secrets aromatiques...'},
        {images: 'accord.png',
            titre: 'Accord Mets & Vins', 
            description: 'Pour prolonger le plaisir de nos évènements avec vos amis, vous pouvez achetez à prix ...'}
    ];
    
    // Informations sur les partenaires
    $scope.myPartenaire = [
        {images: 'Chateau JOLIET - Vin Rouge - Negrette.jpg',
            nom: 'Joliet'},
        {images: 'cransac-blanc-renaiisance.jpg',
            nom: 'Cransac'},
        {images: 'chateau_tarriquet.jpg',
            nom: 'Tariquet'}
    ];
    
    var parDefaut = ['nom','prenom','01012015','ville','motdepasse','votre@email.com'];
    
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
   
    // Initialisation avec valeur par défaut
    $scope.nom = parDefaut[0];
    $scope.prenom = parDefaut[1];
    $scope.age = parDefaut[2];
    $scope.ville = parDefaut[3];
    $scope.password = parDefaut[4];
    $scope.email = parDefaut[5];
    
    $scope.selectedCheckbox = true;
    
    $scope.selected =function(){
      $scope.selectedCheckbox = !$scope.selectedCheckbox;
    };
    
    // Instanciation de Firebase + url base de donnée
    var ref = new Firebase('https://toulouse-so-wine.firebaseio.com/');
    
    // Objet tableau d'utilisateur auquel on passe le lien vers la base en argument 
    var users = $firebaseArray(ref);
    
    // Fonction qui va créer notre utilisateur dans la base
    // On creer un nouvelle utilisateur est on récupere 
    // les informations associés 
    $scope.addUsers = function(){
    ref.createUser({
        email    : $scope.email,
        password : $scope.password
        }, 
        function(error, userData) {
        if (error) 
        {
            console.log("Error creating user:", error);
            alert("Error creation");
        } 
        else 
        {
           console.log("Successfully created user account with uid:", userData.uid);
           alert("Succes creation");
           // Si le compte se créer sans problème on enregistre les données dans la base
           users.$add({ 
               adherents:{
                    id: userData.uid,
                    nom: $scope.nom,
                    prenom: $scope.prenom,
                    dateDeNaissance: $scope.age,
                    ville: $scope.ville,
                    email:$scope.email,
                    password : $scope.password
               },
               niveau_de_connaissance : $scope.niveau[0],
               preferences : $scope.types_preferer.nom
           });

        }

     });
    };

    // Fonction qui va servir à authentifier un utilisateur
    $scope.userLogin = function(){
        ref.authWithPassword({
            email    : $scope.email,
            password : $scope.password
            }, 
                function(error, authData) {
                    if (error) // Si l'utilisateur n'existe pas une erreur est déclencher
                    {
                      console.log("Login Failed!", error);
                      alert("Vous n'etes pas inscrit!");
                    } 
                    else // Sinon ce dernier est logger
                    {
                      console.log("Authenticated successfully with payload:", authData);
                      alert("Succes login");
                    }
            }
        );
    };

    // A développer
    $scope.logFacebook = function(){
        var reffb = $firebaseAuth(ref);
        alert("logFacebook() entrez");
        reffb.authWithOAuthRedirect("facebook", function(error) {
            if (error) {
              console.log("Login Failed!", error);
              alert("error");
            } else {
                alert("redirection ok");
              // We'll never get here, as the page will redirect on success.
            }
          });
        alert("SORTIE DE LA FONCTION");
    };
   
    
   
/*    // MeetUp API url utiliser pour recevoir les données sous format JSON
    var meetupAPI = 
            $http.jsonp("https://api.meetup.com/2/events?&sign=true&photo-host=public&group_urlname=ToulouseSoWine&page=20&key=271548165724ccf206a342412621");

var test = {
    "results":
        [
            {
                "utc_offset":7200000,
                "venue":
                        {
                            "country":"fr",
                            "city":"Ramonville Saint Agne",                
                            "address_1":"69 chemin du mange pomme",
                            "name":"Ferme de Cinquante",
                            "lon":1.490732,
                            "id":23913210,
                            "lat":43.544949,
                            "repinned":false
                        },
                "headcount":0,
                "visibility":"public",
                "waitlist_count":0,
                "created":1438674851000,
                "fee":
                        {
                            "amount":10,
                            "accepts":"cash",
                            "description":"par personne",
                            "currency":"EUR",
                            "label":"Tarifs",
                            "required":"0"
                        },
                "maybe_rsvp_count":0,
                "description":"<p><img src=\"http:\/\/photos1.meetupstatic.com\/photos\/event\/5\/e\/0\/c\/600_440544076.jpeg\" \/><\/p> <p>A l'occasion de la coupe du monde, ToulouseSoWine se met aux couleurs du Rugby.<\/p> <p>Venez participer au coup d'envoi par un barbecue haut en couleurs.<br\/>Du blanc au rouge, éveillez vos sens en vous amusant. <br\/>Et transformez l'essai devant les matchs ou lors de la foire aux vins d'automne.<\/p> <p>Paiement via Payname ou sur place (pour un soucis d'organisation : inscription obligatoire)<\/p>","event_url":"http:\/\/www.meetup.com\/ToulouseSoWine\/events\/224394676\/",
                "yes_rsvp_count":2,
                "duration":10800000,
                "announced":true,
                "name":"BBQ aux couleurs du Rugby",
                "id":"224394676",
                "time":1441445400000,
                "updated":1438674851000,
                "group":
                        {
                            "join_mode":"open",
                            "created":1434748611000,
                            "name":"ToulouseSoWine",
                            "group_lon":1.4500000476837158,
                            "id":18685076,
                            "urlname":"ToulouseSoWine",
                            "group_lat":43.619998931884766,
                            "who":"amateurs toulousains"
                        },
                        "status":"upcoming"
            }
        ],
    "meta":{
        "next":"",
        "method":"Events",
        "total_count":1,
        "link":"https:\/\/api.meetup.com\/2\/events",
        "count":1,
        "description":"Access Meetup events using a group, member, or event id. Events in private groups are available only to authenticated members of those groups. To search events by topic or location, see [Open Events](\/meetup_api\/docs\/2\/open_events).",
        "lon":"",
        "title":"Meetup Events v2",
        "url":"https:\/\/api.meetup.com\/2\/events?offset=0&sign=True&format=json&limited_events=False&group_urlname=ToulouseSoWine&photo-host=public&page=20&fields=&key=271548165724ccf206a342412621&order=time&desc=false&status=upcoming",
        "signed_url":"https:\/\/api.meetup.com\/2\/events?offset=0&format=json&limited_events=False&group_urlname=ToulouseSoWine&photo-host=public&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=112254972&sig=a014967ce1f6f9570f492fe177857ef503dc3ce5",
        "id":"",
        "updated":1438674851000,
        "lat":""
        }
    };
        
        $scope.resultat = [
            angular.fromJson(test.results[0]),
            angular.fromJson(test.results)
        ];
        alert($scope.resultat[0].venue.city +
                $scope.resultat[0].venue.name +
                $scope.resultat[0].name
                );
        $scope.testjson = $scope.resultat[0].description;
        */
}]);

