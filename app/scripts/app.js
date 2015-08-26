var blocJams = angular.module('blocJams', ['ui.router']);

	blocJams.config(function($stateProvider, $locationProvider) {

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
	});

 blocJams.controller('Landing.controller', function ($scope) {
 	$scope.landingTitle = 'Turn the music up!';
 });

 blocJams.controller('Album.controller', function ($scope) {
 	$scope.picasso = albumPicasso;
 });

 blocJams.controller('Collection.controller', function ($scope) {
 	$scope.picasso = albumPicasso;
 	$scope.number = 12;
	$scope.getNumber = function(num) {
    	return new Array(num);   
	}
 });
 