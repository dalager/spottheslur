angular.module('Annotator.App', ['ngAnimate'])
    .service('tweetService', ['$log', '$http', '$q', function ($log, $http, $q) {
        var fakegetTweets = function () {
            $log.debug('getting tweets');
            return [
                { id: '1', tweet: "Gamergaters calling to tell us they are coming to our house to kill us. Using THEIR PHONE NUMBER.  Come on, @FBI. You can crack this one!" },
                { id: '2', tweet: "@CodingJungle because all of his claims are patently ridiculous and a cursory look at basic sociology would dismiss all of them?" },
                { id: '3', tweet: "Men finally get the recognition they deserve for their hard work in being men on all-male panels http://t.co/yurBXFY6Cl" },
                { id: '4', tweet: "@Peanutbeanjelly @11twiggins ... how is that censorship? she's criticizing a game. that isn't censorship. do words not mean anything?" },
                { id: '5', tweet: "My view on Asian people is the same as turtles, if they're not Ninjas then I don't give a fuck." },
                { id: '6', tweet: "How many black people does it take to pave a road? Depends on how heavy the roller is." },
                { id: '7', tweet: "It's hilarious when school textbooks try too hard at being racially diverse. \"Brad, Latisha, Pablo and Kwan were doing a math problem...\"" },
                { id: '8', tweet: "What do you call a gay bar with no bar stools? A fruit stand." },
                { id: '9', tweet: "Mohammed travels 100 miles by camel, each camel can only travel 25 miles. Is Mohammed on a no fly list? #RacistMathProblems" },
                { id: '10', tweet: "I just heard a group of Chinese chanting, \"We want rights! We want rights!\"  They must be scared of the dark or something" }
            ];
        };

        var getTweets = function () {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/next'
            })
                .then(function successCallback(response) {
                    console.log('got this ', response);
                    deferred.resolve(response.data);
                },
                    function errCallback(response) {
                        console.error(response);
                        deferred.reject(response);
                    });
            return deferred.promise;
        };


        var annotateTweet = function(id,annotation){
          var deferred = $q.defer();
          
          $http({
              method: 'POST',
              url:'/annotate',
              data: {_id:id,annotation:annotation}
          }).then(function success(resp){
              deferred.resolve(resp.data);
          },function error(resp){
              deferred.reject(resp);
          });
          
          return deferred.promise;  
        };

        return {
            getTweets: getTweets,
            annotateTweet: annotateTweet
        };
    }])

    .controller('MainController', ['$scope', 'tweetService', '$log', '$timeout', function ($scope, tweetService, $log, $timeout) {
        var tweets = [];
        $scope.sessionCounter = 0;
        var takeNext = function () {
                if (tweets.length > 0) {
                    $scope.selectedTweet = null;
                    $timeout(function () {
                        $log.debug('timeout');
                        $scope.selectedTweet = tweets.shift();
                    }, 700);
                } else {
                   getNextbatch();
                }
            };        
        $scope.selectedTweet = { id: null, tweet: '' };

        var getNextbatch = function(){
            tweetService.getTweets().then(function (data) {
                $log.debug('got ', data.length);
                tweets=data;
                takeNext();
            });
        };
        getNextbatch();
            




        $scope.annotations = [
            { code: 'Racism', title: 'Racism', text: 'Tweet is racist', shortcut: 'r', keyCode: 82 },
            { code: 'Sexism', title: 'Sexism', text: 'Tweet is sexist', shortcut: 's', keyCode: 83 },
            { code: 'Both', title: 'Both', text: 'Tweet is both racist and sexist', shortcut: 'b', keyCode: 66 },
            { code: 'Neither', title: 'None', text: 'Tweet is neither racist nor sexist', shortcut: 'n', keyCode: 78 },
            { code: 'Noise', title: 'Noise', text: 'Tweet is not in English', shortcut: 'z', keyCode: 90 },
            { code: 'Skipped', title: 'Skip', text: 'Too hard. Give me another!', shortcut: 'x', keyCode: 88 },
        ];

        $scope.keypressed = function (e) {
            if (e.ctrlKey || e.altKey) {
                return;
            }
            $log.debug('keyCode', e.keyCode);
            var matches = $scope.annotations.filter(function (a) { return a.keyCode === e.keyCode; });
            if (matches.length > 0) {
                postChoice(matches[0]);
            }
        };

        var postChoice = function (annotation) {
            $log.debug('picked ', annotation);
            annotation.picked = true;
            $timeout(function () { annotation.picked = false; }, 400);
            // send away!
            tweetService.annotateTweet($scope.selectedTweet._id,annotation.code).then(function(){
                console.log('annotated!');
                $scope.sessionCounter++;
            }).catch(function(err){console.error(err);});
                
            
            
            takeNext();
        };

        $scope.select = function (annotation) {
            postChoice(annotation);
        };
    }]);