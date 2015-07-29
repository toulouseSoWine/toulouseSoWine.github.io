/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {

        $('#loginForm').formValidation({
        framework: 'bootstrap',
        excluded: [':disabled'],
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        
        fields: {
            nom: {
                validators: {
                    notEmpty: {
                        message: 'Le nom est requis'
                    }
                }
            },
            prenom: {
                validators: {
                    notEmpty: {
                        message: 'Le prenom est requis'
                    }
                }
            },
            age: {
                validators: {
                    notEmpty: {
                        message: 'La date de naissance est requise'
                    }
                }
            },
            ville: {
                validators: {
                    notEmpty: {
                        message: 'La ville est requise'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message:  'L\'email est requis'
                    }
                }
            }
        }
    });
});

