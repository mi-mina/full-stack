'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            $scope.showMenu = false;
            $scope.message = "Loading ...";
            $scope.dishes={};
            // We initialize this as an empty object, until we get the response
            //from the server.

            menuFactory.getDishes()
            .then(
              function(response){
                console.log(response); //To see the object response in the console

      // The response object has these properties: (from Angular API Reference)
      // data – {string|Object} – The response body transformed with the transform functions.
      // status – {number} – HTTP status code of the response.
      // headers – {function([headerName])} – Header getter function.
      // config – {Object} – The configuration object that was used to generate the request.
      // statusText – {string} – HTTP status text of the response.

                $scope.dishes = response.data;
                $scope.showMenu = true;
              },
              function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
              }
            );


            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = "appetizer";
                }
                else if (setTab === 3) {
                    $scope.filtText = "mains";
                }
                else if (setTab === 4) {
                    $scope.filtText = "dessert";
                }
                else {
                    $scope.filtText = "";
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', function($scope) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {
            $scope.showDish = false;
            $scope.message="Loading ...";
            $scope.dish = {};
            //Empty JS object
            menuFactory.getDish(parseInt($stateParams.id,10))
            .then(
              function(response){
                  $scope.dish = response.data;
                  $scope.showDish=true;
              },
              function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
              }
            );

        }])

        .controller('DishCommentController', ['$scope', function($scope) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);
                // DishCommentController is inside the DishDetailController,
                // that's why we can access $scope.dish from here

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', 'menuFactory',
        'corporateFactory', function($scope, menuFactory, corporateFactory){
          $scope.showDish = false;
          $scope.message="Loading ...";

          $scope.dish = {};
          menuFactory.getDish(0)
          .then(
            function(response){
              $scope.dish = response.data;
              $scope.showDish = true;
            },
            function(response) {
              $scope.message = "Error: "+response.status + " " + response.statusText;
            }
          );

          var promotion= menuFactory.getPromotion(0);
          $scope.promotion = promotion;

          $scope.leader= corporateFactory.getLeader(3);
          // We also can link leader to $scope this way

        }])

        .controller('AboutController', ['$scope', 'corporateFactory',
        function($scope, corporateFactory){
          var leaders = corporateFactory.getLeaders();
          $scope.leaders = leaders;

        }])

;
