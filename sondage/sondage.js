angular
  .module('sent-mobilite', [])
  .directive('article', function() {
    return {
      restrict: 'E',
      link: function($scope, elm, attrs) {
      },
      controller: function($scope, $location) {

        $scope.sections = [
          "introduction",
          "main",
          "scolaire",
          "covoiturage",
          "partage",
          "demande",
          "douce",
          "merci"
        ];

        this.conditions = [
          function(answers){ return true; },
          function(answers){ return true; },
          function(answers){ return answers["main-scolaire"]; },
          function(answers){ return answers["main-covoiturage"]; },
          function(answers){ return answers["main-partage"]; },
          function(answers){ return answers["main-demande"]; },
          function(answers){ return answers["main-douce"]; },
          function(answers){ return true; },
        ];

        $scope.currentIndex = (function(){
          var hash = $location.hash();
          if (hash) {
            return $scope.sections.indexOf(hash) || 0;
          } else {
            return 0;
          }
        })();

        this.answers = {};

        this.$watch = $scope.$watch.bind($scope);

        this.isCurrent = function(sectionId) {
          return $scope.sections[$scope.currentIndex] == sectionId;
        }

        this.toggleAnswer = function(id) {
          this.answers[id] = this.answers[id] ? false : true;
          return this.answers[id];
        }

        this.findPage = function(functor) {
          var check = this.conditions[$scope.currentIndex];
          if (!check(this.answers)) {
            functor.bind(this)();
          }
        }

        this.start = function() {
          $scope.currentIndex = 1;
        }
        $scope.start = this.start.bind(this);

        this.previous = function() {
          $scope.currentIndex = Math.max($scope.currentIndex-1, 0);
          this.findPage(this.previous);
        }
        $scope.previous = this.previous.bind(this);

        this.next = function() {
          $scope.currentIndex = Math.min($scope.currentIndex+1, $scope.sections.length-1);
          this.findPage(this.next);
        }
        $scope.next = this.next.bind(this);
      }
    };
  })
  .directive('section', function(){
    return {
      restrict: 'E',
      require: "^article",
      link: function($scope, elm, attrs, articleCtrl) {

        articleCtrl.$watch('currentIndex', function(){
          if (articleCtrl.isCurrent(attrs.id)) {
            elm.css("display", "block");
          } else {
            elm.css("display", "none");
          }
        })

      }
    };
  })
  .directive('li', function(){
    return {
      restrict: 'E',
      require: "^article",
      link: function($scope, elm, attrs, articleCtrl) {

        elm.on('click', function() {
          $scope.$apply(function() {
            if (articleCtrl.toggleAnswer(attrs.id)) {
              elm.addClass("selected")
            } else {
              elm.removeClass("selected");
            }
          })
        })

      }
    };
  })
;