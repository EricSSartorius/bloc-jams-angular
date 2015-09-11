angular.module('blocJams', ['ui.router'])
	.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

 	    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
     	});

    $urlRouterProvider.otherwise("/landing");

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

    // window.skope = $scope;
 
 	$scope.getDuration = function() {
     	if($scope.playingTrackIndex !== null) {
     		$scope.duration = MusicPlayer.getDuration();
     	}
    };
	$scope.updateTime = function() {
     	if($scope.playingTrackIndex !== null) {
     		$scope.time = MusicPlayer.getTime();
     	}
    };
 	$scope.infoShow = function() {
     	if($scope.playingTrackIndex !== null) {
     		return true;
     	}
     	else {
     		return false;
     	}
    };
 	$scope.setVolume = function() {
         MusicPlayer.setVolume(volume);
  };
  $scope.togglePlayPause = function() {
    	$scope.togglePlay = MusicPlayer.togglePlayFromPlayerBar();
    	if ($scope.playingTrackIndex === null) {
    		$scope.playingTrackIndex = 0;
        MusicPlayer.registerProgressListener(function(){
          $scope.$apply(function(){
            $scope.updateTime();
          })
        });
    	}
  };
  $scope.enterHover = function(index) {
      $scope.hoveredIndex = index;
  };
  $scope.leaveHover = function(index) {
      $scope.hoveredIndex = null;
  };
  $scope.hideTrack = function(index) {
    	if($scope.hoveredIndex === index || $scope.playingTrackIndex === index) {
    		return true;
    	}
    	else{
    		return false;
    	}
  };
  $scope.isPaused = function() {
     	if (MusicPlayer.isPaused()) {
     		return true;
     	}
     	else {
     		return false;
     	}
  };
 	$scope.pauseSong = function(index) {
      　MusicPlayer.pause();
      	$scope.playingTrackIndex = index;
      	$scope.togglePlay = true;
  };
  $scope.playSong = function(index) {		
		if ($scope.playingTrackIndex !== index){
			MusicPlayer.setSong(index+1);
		}
		$scope.playingTrackIndex = index;
		MusicPlayer.play();
		$scope.togglePlay = false;
	  MusicPlayer.registerProgressListener(function(){
      $scope.$apply(function(){
        $scope.updateTime();
      })
    });

  };
	$scope.nextSong = function() {
        MusicPlayer.nextSong();
        $scope.playingTrackIndex++;
        MusicPlayer.registerProgressListener(function(){
          $scope.$apply(function(){
            $scope.updateTime();
          })
        });
        if ($scope.playingTrackIndex >= $scope.album.songs.length) {
        		$scope.playingTrackIndex = 0;
    		}
        $scope.togglePlay = false;
  };
  $scope.previousSong = function() {
      MusicPlayer.previousSong();
  		$scope.playingTrackIndex--;
      MusicPlayer.registerProgressListener(function(){
          $scope.$apply(function(){
            $scope.updateTime();
          })
      });
      if ($scope.playingTrackIndex < 0) {
        	$scope.playingTrackIndex = $scope.album.songs.length - 1;
    	}
      $scope.togglePlay = false;
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
    var currentVolume = 80;

    var trackIndex = function(album, song) {
        return album.songs.indexOf(song);
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
      isPaused: function() {
          return currentSoundFile.isPaused();
      },
      ended: function() {
          return currentSoundFile.isEnded();
      },
      getTime: function() {
          return currentSoundFile.getTime();
      },
      registerProgressListener: function(listener){
           currentSoundFile.bind("timeupdate", listener);
      },
      getDuration: function() {
          currentSoundFile.getDuration();
      },
      pause: function() {
          currentSoundFile.pause();
      },
      play: function() {
          currentSoundFile.play();
      },
      nextSong: function() {
      //      var getLastSongNumber = function(index) {
      //   		return index == 0 ? currentAlbum.songs.length : index;
    	// };
       	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
       	currentSongIndex++;
       	if (currentSongIndex >= currentAlbum.songs.length) {
          		currentSongIndex = 0;
       	}
       	this.setSong(currentSongIndex + 1);
       	currentSoundFile.play();
       	// updateSeekBarWhileSongPlays();
       	// updatePlayerBarSong();
       	// var lastSongNumber = getLastSongNumber(currentSongIndex);
      },
      previousSong: function() {
      //   	var getLastSongNumber = function(index) {
      //   		return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    	// };
        	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        	currentSongIndex--;
        	if (currentSongIndex < 0) {
            	currentSongIndex = currentAlbum.songs.length - 1;
        	}
        	this.setSong(currentSongIndex + 1);
        	currentSoundFile.play();
        	// updateSeekBarWhileSongPlays();
        	// updatePlayerBarSong();
        	// var lastSongNumber = getLastSongNumber(currentSongIndex);
      }
    };
})
.directive('mySlider', function() {

 //  resetSong = function(){
 //      var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
 //      if (currentSoundFile.isEnded()){
 //           if (currentSongIndex >= currentAlbum.songs.length -1) {
 //              currentSoundFile.stop();
 //              $('.album-song-button').html(playButtonTemplate);
 //              $('.left-controls .play-pause').html(playerBarPlayButton);
 //           }  
 //           else {
 //              this.nextSong();
 //          }
 //      }
 //  };
 //  var updateSeekBarWhileSongPlays = function() {
 //    if (currentSoundFile) {
 //        currentSoundFile.bind('timeupdate', function(event) {
 //            var seekBarFillRatio = this.getTime() / this.getDuration();
 //            var $seekBar = $('.seek-control .seek-bar');
 //            updateSeekPercentage($seekBar, seekBarFillRatio);
 //            setCurrentTimeInPlayerBar(this.getTime());
 //            resetSong();
 //        });
 //    }
 // };
 // var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
 //    var offsetXPercent = seekBarFillRatio * 100;
 //    offsetXPercent = Math.max(0, offsetXPercent);
 //    offsetXPercent = Math.min(100, offsetXPercent);
 //    var percentageString = offsetXPercent + '%';
 //    $seekBar.find('.fill').width(percentageString);
 //    $seekBar.find('.thumb').css({left: percentageString});
 // };

     return {
         templateUrl: 'templates/album.html',
         restrict: 'E',
         replace: true,
         scope: { },
         controller: function() {

         },
         link: function(scope, element, attributes) {
             // scope.value = 0;
             // scope.doSomething = function() {
             //     return { width: performAction() };
             // };
             // var $someElement = $(element);
            element.bind('click', function () {
                if (currentlyPlayingSongNumber === null) {
                    return;
                }
                var offsetX = event.pageX - $(this).offset().left;
                var barWidth = $(this).width();
                var seekBarFillRatio = offsetX / barWidth;
                if ($(this).parent().attr('class') == 'seek-control') {
                    seek(seekBarFillRatio * currentSoundFile.getDuration());
                    }
                else{
                    setVolume(seekBarFillRatio * 100);
                }
                updateSeekPercentage($(this), seekBarFillRatio);
            });
            element.bind('mousedown', function () {
                var $seekBar = $(this).parent();
                $(document).bind('mousemove.thumb', function(event){
                var offsetX = event.pageX - $seekBar.offset().left;
                var barWidth = $seekBar.width();
                var seekBarFillRatio = offsetX / barWidth;
                if (currentlyPlayingSongNumber === null) {
                    return;
                }
                if ($seekBar.parent().attr('class') == 'seek-control') {
                    seek(seekBarFillRatio * currentSoundFile.getDuration()); 
                }
                else{
                   setVolume(seekBarFillRatio);
                }
                updateSeekPercentage($seekBar, seekBarFillRatio);
                });
                $(document).bind('mouseup.thumb', function() {
                $(document).unbind('mousemove.thumb');
                $(document).unbind('mouseup.thumb');
                });
            });
            var $seekBars = $('.player-bar .seek-bar');
         }
     };
 })
.filter('filterTime', function() {

    return function(timeInSeconds) {
      var time = parseFloat(timeInSeconds);
      var wholeMinutes = Math.floor(time / 60);
      var wholeSeconds = Math.floor(time - wholeMinutes * 60);
      if (wholeSeconds >= 10) {
          var formatTime = wholeMinutes + ":" + wholeSeconds;
      }
      else{
         var formatTime = wholeMinutes + ":0" + wholeSeconds; 
      }
      return formatTime;
   };
});
