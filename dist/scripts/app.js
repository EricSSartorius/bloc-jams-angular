<<<<<<< HEAD
angular.module('blocJams', ['ui.router']);

 myAppModule.config(function($stateProvider, $locationProvider) {

=======
angular.module('blocJams', ['ui.router'])
 .config(function($stateProvider, $locationProvider) {

>>>>>>> checkpoint-4-controllers
 	    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     	});
     	
		$stateProvider
			.state('landing', {
		    	url: '/landing',
		    	controller: 'Landing.controller',
		    	templateUrl: '/templates/landing.html'
			})
<<<<<<< HEAD
			.state('', {
=======
			.state('album', {
>>>>>>> checkpoint-4-controllers
		        url: '/album',
		        controller: 'Album.controller',
		        templateUrl: '/templates/album.html'
      		})
      		.state('collection', {
          		url: '/collection',
          		controller: 'Collection.controller',
          		templateUrl: '/templates/collection.html'
      		});
 });



 