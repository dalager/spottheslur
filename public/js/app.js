angular.module('Annotator.App',['ngAnimate'])
.service('tweetService',['$log',function($log){
   var getTweets = function(){
       $log.debug('getting tweets');
       return [
           {id:'1',tweet:"Gamergaters calling to tell us they are coming to our house to kill us. Using THEIR PHONE NUMBER.  Come on, @FBI. You can crack this one!"},
           {id:'2',tweet:"@CodingJungle because all of his claims are patently ridiculous and a cursory look at basic sociology would dismiss all of them?"},
           {id:'3',tweet:"Men finally get the recognition they deserve for their hard work in being men on all-male panels http://t.co/yurBXFY6Cl"},
           {id:'4',tweet:"@Peanutbeanjelly @11twiggins ... how is that censorship? she's criticizing a game. that isn't censorship. do words not mean anything?"},
           {id:'5',tweet:"My view on Asian people is the same as turtles, if they're not Ninjas then I don't give a fuck."},
           {id:'6',tweet:"How many black people does it take to pave a road? Depends on how heavy the roller is."},
           {id:'7',tweet:"It's hilarious when school textbooks try too hard at being racially diverse. \"Brad, Latisha, Pablo and Kwan were doing a math problem...\""},
           {id:'8',tweet:"What do you call a gay bar with no bar stools? A fruit stand."},
           {id:'9',tweet:"Mohammed travels 100 miles by camel, each camel can only travel 25 miles. Is Mohammed on a no fly list? #RacistMathProblems"},
           {id:'10',tweet:"I just heard a group of Chinese chanting, \"We want rights! We want rights!\"  They must be scared of the dark or something"}
       ];
   };
   return {
       getTweets: getTweets
   };
}])

.controller('MainController',['$scope','tweetService','$log','$timeout',function($scope,tweetService,$log,$timeout){
    var tweets = tweetService.getTweets();
    $log.debug('got ',tweets.length);
    
    $scope.selectedTweet={id:null,tweet:''};
    var takeNext = function(){
        if(tweets.length>0){
            $scope.selectedTweet = null;
            $timeout(function(){
                $log.debug('timeout');
                $scope.selectedTweet = tweets.shift();
            },700);
        }else{
            //get new tweets
        }
    };
    takeNext();
        
    $scope.annotations = [
        {code:'A',title:'Racism',text:'Tweet is racist',shortcut:'r',keyCode:82},
        {code:'B',title:'Sexism',text:'Tweet is sexist',shortcut:'s',keyCode:83},
        {code:'C',title:'Both',text:'Tweet is both racist and sexist',shortcut:'b',keyCode:66},
    ];
    
    $scope.keypressed=function(e){
        var matches=$scope.annotations.filter(function(a){return a.keyCode===e.keyCode;});
        if(matches.length>0){
            postChoice(matches[0]);
        }
    };
    
    var postChoice=function(annotation){
        $log.debug('picked ', annotation);
        // send away!
        takeNext();
    };
    
    $scope.select=function(annotation){
        postChoice(annotation);
    };
}]);