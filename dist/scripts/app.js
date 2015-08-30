angular.module('blocJams', ['ui.router', 'services'])
	.config(function($stateProvider, $locationProvider) {

 	    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     	});
     	
		$stateProvider
			.state('landing', {
		    	url: '/landing',
		    	controller: 'Landing.controller',
		    	templateUrl: '/templates/landing.html',
			})
			.state('album', {
		        url: '/album',
		        controller: 'Album.controller',
		        templateUrl: '/templates/album.html',
      		})
      		.state('collection', {
          		url: '/collection',
          		controller: 'Collection.controller',
          		templateUrl: '/templates/collection.html',
      		});
	})
.controller('Landing.controller', function ($scope, $rootScope) {
 	$scope.landingTitle = 'Turn the music up!';
 	$rootScope.bodyClass = "landing";

 	var points = document.getElementsByClassName('point');       
    var revealPoint = function(){
        for(var i = 0; i < 3; i++){
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateY(0)";   
        }
    };
    revealPoint();   
 	   //  var revealPoint = function() {
	    //     $(this).css({
	    //          opacity: 1,
	    //          transform: 'scaleX(1) translateY(0)',
	    //      });
	    
	    // };
	    // angular.forEach(points, revealPoint)
	    // $.each($('.point'), revealPoint);
 })
.controller('Album.controller', function ($scope, $rootScope, MusicPlayer) {
 	$scope.album = albumPicasso;
 	$rootScope.bodyClass = "album";
 	$scope.togglePlay = true;

    $scope.togglePlayPause = function() {
    	// MusicPlayer.togglePlayFromPlayerBar();
    	$scope.togglePlay = $scope.togglePlay === MusicPlayer.togglePlayFromPlayerBar();
    };
 	$scope.pauseSong = function(song) {
         MusicPlayer.pause();
    };
    $scope.playSong = function(song) {
         MusicPlayer.play();
    };
	$scope.nextSong = function(song) {
         MusicPlayer.nextSong();
    };
    $scope.previousSong = function(song) {
         MusicPlayer.previousSong();
    };
 })
.controller('Collection.controller', function ($scope, $rootScope) {
 // 	$scope.picasso = albumPicasso;
 // 	$scope.number = 12;
	// $scope.getNumber = function(num) {
 //    	return new Array(num);   
	// }
	$scope.albums = [albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits];
	$rootScope.bodyClass = "collection";
 });
