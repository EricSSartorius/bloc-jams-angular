angular.module('blocJams', ['ui.router'])
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
 })
.controller('Album.controller', function ($scope, $rootScope, MusicPlayer) {
 	$scope.album = albumPicasso;
 	MusicPlayer.setCurrentAlbum(albumPicasso);
 	$rootScope.bodyClass = "album";
 	$scope.togglePlay = true;
 	$scope.playingTrackIndex = null;

 	$scope.setVolume = function() {
         MusicPlayer.setVolume(volume);
    };
    $scope.togglePlayPause = function() {
    	$scope.togglePlay = MusicPlayer.togglePlayFromPlayerBar();
    	if($scope.togglePlay === true){
	    	$scope.showPlay = true;
	    	$scope.showPause= false;
	    	$scope.hideTrack = true;
    	}
    	else if ($scope.togglePlay === false){
			$scope.showPlay = false;
    		$scope.showPause= true;
    		$scope.hideTrack = true;
    	}
    };
    $scope.enterHover = function(index) {
    	$scope.playingTrackIndex = MusicPlayer.currentlyPlayingSongNumber;
    	$scope.showPlay = true;
    	$scope.showPause= false;
    	$scope.hideTrack = true;
    	if($scope.playing) {
    		$scope.showPlay = false;
    		$scope.showPause= true;
    		$scope.hideTrack = true;
    	}
    };
    $scope.leaveHover = function(index) {
		$scope.playingTrackIndex = MusicPlayer.currentlyPlayingSongNumber;
    	$scope.showPlay = false;
    	$scope.showPause = false;
    	$scope.hideTrack = false;
    	if($scope.playing) {
    		$scope.showPlay = false;
    		$scope.showPause= true;
    		$scope.hideTrack = true;
    	}
    };
    // $scope.hideShow = function() {
    // 	if($scope.showPlay || $scope.showPause) {
    // 		$scope.hideTrack = true;
    // 	}
    // 	else{
    // 		$scope.hideTrack = false;
    // 	}
    // };
 	$scope.pauseSong = function(index) {
      　MusicPlayer.pause();
        $scope.playingTrackIndex = MusicPlayer.currentlyPlayingSongNumber;
      　$scope.togglePlay = true;
        $scope.showPlay = true;
    	$scope.showPause= false;
    	$scope.hideTrack = true;
    	$scope.playing = false;
    };
    $scope.playSong = function(index) {
        MusicPlayer.setSong(index+1);
        $scope.playingTrackIndex = MusicPlayer.currentlyPlayingSongNumber;
        MusicPlayer.play();
        $scope.togglePlay = false;
        $scope.showPlay = false;
    	$scope.showPause= true;
    	$scope.playing = true;
    	$scope.hideTrack = true; // simplify the view to look at both showPause and showPlay
    };
	$scope.nextSong = function(song) {
         MusicPlayer.nextSong();
    };
    $scope.previousSong = function(song) {
         MusicPlayer.previousSong();
    };
 })
.controller('Collection.controller', function ($scope, $rootScope) {
	$scope.albums = [albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits,albumPicasso, albumMarconi, albumFruits];
	$rootScope.bodyClass = "collection";
 })
.factory('MusicPlayer', function() {
    var currentAlbum = null;
    var currentlyPlayingSongNumber = null;
    var currentSongFromAlbum = null;
    var currentSoundFile = null;
    var currentSongDuration = null;
    var currentVolume = 80;

    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
    };
    resetSong = function(){
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        if (currentSoundFile.isEnded()){
             if (currentSongIndex >= currentAlbum.songs.length -1) {
                currentSoundFile.stop();
                $('.album-song-button').html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
             }  
             else {
                nextSong();
            }
        }
    };

    return { 
	    setCurrentAlbum: function(album) {
	         currentAlbum = album;
	         for (i = 0; i < album.songs.length; i++) {
	            var sound = new buzz.sound(album.songs[i].audioUrl, {  formats: [ 'mp3' ],   preload: 'metadata'  });
	             var mySound = function(i,sound){
	                return function(){
	                    var length = sound.getDuration();
	                }
	            };
	            sound.bind("loadedmetadata", mySound(i,sound));
	         }    
	    },
    	setSong: function(songNumber) {
	        if (currentSoundFile) {
	            currentSoundFile.stop();
	        }
	        currentlyPlayingSongNumber = songNumber;
	        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	        //currentSongDuration = currentSongDurations[songNumber - 1];
	        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
	            formats: [ 'mp3' ],
	            preload: true
	        });
	        this.setVolume(currentVolume);
	    },
    	setVolume: function(volume) {
        	if (currentSoundFile) {
            	currentSoundFile.setVolume(volume);
         	}
     	},
        togglePlayFromPlayerBar: function(){
                if (currentlyPlayingSongNumber === null){
                    return this.nextSong();
                    return false;
                }
                if(currentSoundFile.isPaused()) {
                    currentSoundFile.play();
                    return false;
                }
                else if(currentSoundFile) {
                    currentSoundFile.pause();
                    return true;
                }
        },
        pause: function() {
            currentSoundFile.pause();
        },
        play: function() {
            currentSoundFile.play();
        },
        nextSong: function() {
            var getLastSongNumber = function(index) {
        		return index == 0 ? currentAlbum.songs.length : index;
    		};
    		var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    		currentSongIndex++;
    		if (currentSongIndex >= currentAlbum.songs.length) {
        		currentSongIndex = 0;
    		}
    		this.setSong(currentSongIndex + 1);
    		currentSoundFile.play();
    		// updateSeekBarWhileSongPlays();
    		// updatePlayerBarSong();
    		var lastSongNumber = getLastSongNumber(currentSongIndex);
        },
        previousSong: function() {
        	var getLastSongNumber = function(index) {
        		return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    		};
        	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        	currentSongIndex--;
        	if (currentSongIndex < 0) {
            	currentSongIndex = currentAlbum.songs.length - 1;
        	}
        	this.setSong(currentSongIndex + 1);
        	currentSoundFile.play();
        	// updateSeekBarWhileSongPlays();
        	// updatePlayerBarSong();
        	var lastSongNumber = getLastSongNumber(currentSongIndex);
        }
    };
});
