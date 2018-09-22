angular
  .module('sent-mobilite', [])
  .directive('article', function() {
    return {
      restrict: 'E',
      link: function($scope, elm, attrs) {
      },
      controller: function($scope, $location, $http, $timeout) {

        $scope.sections = [
          "introduction",
          "main",
          "scolaire",
          "covoiturage",
          "commun",
          "partage",
          "demande",
          "douce",
          "soumission",
          "merci"
        ];

        this.conditions = [
          function(answers){ return true; },
          function(answers){ return true; },
          function(answers){ return answers["main"]["scolaire"]; },
          function(answers){ return answers["main"]["covoiturage"]; },
          function(answers){ return answers["main"]["commun"]; },
          function(answers){ return answers["main"]["partage"]; },
          function(answers){ return answers["main"]["demande"]; },
          function(answers){ return answers["main"]["douce"]; },
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

        this.answers = { main: {} };
        $scope.answers = this.answers;

        this.$watch = $scope.$watch.bind($scope);

        this.isCurrent = function(sectionId) {
          return $scope.sections[$scope.currentIndex] == sectionId;
        }

        this.toggleAnswer = function(section, id, value) {
          this.answers[section] = this.answers[section] || {};
          if (this.answers[section][id]) {
            delete this.answers[section][id];
          } else {
            this.answers[section][id] = value;
          }
          return !!this.answers[section][id];
        }

        this.setAnswer = function(section, id, value) {
          this.answers[section] = this.answers[section] || {};
          this.answers[section][id] = value;
        }

        this.isSelectedAnswer = function(section, id) {
          this.answers[section] = this.answers[section] || {};
          return !!this.answers[section][id];
        }

        this.findPage = function(functor) {
          var check = this.conditions[$scope.currentIndex];
          if (check && !check(this.answers)) {
            functor.bind(this)();
          } else {
            $timeout(function(){
              window.scrollTo(0, 0);
            });
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

        this.canNext = function(section) {
          var index = $scope.sections.indexOf(section);
          return this.answers[section] && Object.keys(this.answers[section]).length > 0;
        }

        this.next = function() {
          $scope.currentIndex = Math.min($scope.currentIndex+1, $scope.sections.length-1);
          this.findPage(this.next);
        }
        $scope.next = this.next.bind(this);

        this.submitAnswers = function() {
          $http
            .post('./answers/', this.answers)
            .then(this.next.bind(this))
            .catch(function(err) {
              console.log(err);
              alert("Désolé une erreur survenue, merci de réessayer");
            })
          ;
        }
        $scope.submitAnswers = this.submitAnswers.bind(this);
      }
    };
  })
  .directive('section', function(){
    return {
      restrict: 'E',
      require: "^article",
      scope: true,
      link: function($scope, elm, attrs, articleCtrl) {
        $scope.sectionId = attrs.id;

        articleCtrl.$watch('currentIndex', function(){
          if (articleCtrl.isCurrent(attrs.id)) {
            elm.css("display", "block");
          } else {
            elm.css("display", "none");
          }
        })

        $scope.canNext = function() {
          return articleCtrl.canNext($scope.sectionId);
        }

        $scope.cartoLink = function(modality) {
          return "https://sent-mobilite.klaro.cards/boards/par-moyen-de-transport?modalite=" + modality;
        }

        $scope.restart = function() {
          window.location = window.location;
        }

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
            if (articleCtrl.toggleAnswer($scope.sectionId, attrs.answer, elm.text())) {
              elm.addClass("selected")
            } else {
              elm.removeClass("selected");
            }
          })
        })

      }
    };
  })
  .directive('autre', function(){
    return {
      restrict: 'C',
      require: "^article",
      template: "{{label}}&nbsp;&hellip;<textarea placeholder=\"{{placeholder}}\"></textarea>",
      scope: true,
      link: function($scope, elm, attrs, articleCtrl) {

        $scope.label = attrs.label || "Autre";
        $scope.placeholder = attrs.placeholder || "";

        var textarea = elm.find('textarea');
        textarea.css('display','none');
        textarea.on('click', function(event){
          event.stopPropagation();
        });
        textarea.on('change', function(){
          $scope.$apply(function() {
            articleCtrl.setAnswer($scope.sectionId, attrs.answer, textarea.val());
          });
        });

        elm.on('click', function(event) {
          $scope.$apply(function() {
            if (articleCtrl.isSelectedAnswer($scope.sectionId, attrs.answer)) {
              textarea.css('display','block');
              textarea[0].focus();
            } else {
              textarea.css('display','none');
              textarea.val('');
            }
          });
        })

      }
    };
  })
;