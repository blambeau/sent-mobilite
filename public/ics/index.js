angular
  .module('sent-ics', [])
  .controller('IcsController', function($scope, $http){
    $scope.success = false;
    $scope.ics = {
      personne: {
        dateInscription: new Date()
      }
    };
    $scope.submitForm = function() {
      $http
        .post("/ics/", $scope.ics)
        .then(function(){
          $scope.success = true;
        })
        .catch(function(){
          alert("Une erreur s'est produite, veuillez réessayer plus tard");
        })
      ;
    }
  })
  .run(function(){
  })
;
