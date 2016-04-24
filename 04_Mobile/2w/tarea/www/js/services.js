'use strict';

angular.module('conFusion.services',['ngResource'])
// Tenemos que injectar ngResource. No sé por qué antes no lo teníamos que injectar.
// ¿Es porque esto no es una Angular app sino una Ionic app?
        .constant("baseURL","http://localhost:3000/")
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

                this.getDishes = function(){
                  return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
                };

                this.getPromotion = function() {
                  return $resource(baseURL+"promotions/:id");
                };

        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"leadership/:id");

        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"feedback/:id");

        }])

        .factory('favoriteFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
          var favFac = {};
          var favorites = [];

          favFac.addToFavorites = function (index) {
            for (var i = 0; i < favorites.length; i++) {
              if (favorites[i].id == index)
                  return;
                }
                favorites.push({id: index});
              };

            favFac.deleteFromFavorites = function (index) {
              for (var i = 0; i < favorites.length; i++) {
                if (favorites[i].id == index) {
                  favorites.splice(i, 1);
                }
              }
            }

            favFac.getFavorites = function () {
              return favorites;
            };

            return favFac;
          }])
;
