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
  window.skope = $scope;
  $scope.volume = 80;
  $scope.$watch('volume', function(){
     MusicPlayer.setVolume($scope.volume);
  });

  $scope.listener = function() {
      MusicPlayer.registerProgressListener(function(){
          $scope.$apply(function(){
            $scope.updateTime();
            $scope.updateDuration();
          })
      });
  };
 	$scope.updateDuration = function() {
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
     	return $scope.playingTrackIndex !== null;
    };
 	$scope.setVolume = function() {
         MusicPlayer.setVolume(volume);
  };
  $scope.togglePlayPause = function() {
    	$scope.togglePlay = MusicPlayer.togglePlayFromPlayerBar();
    	if ($scope.playingTrackIndex === null) {
    		$scope.playingTrackIndex = 0;
    	}
      if (!$scope.togglePlay || ($scope.togglePlay && $scope.playingTrackIndex === null)) {
          $scope.listener();
      }
  };
  $scope.enterHover = function(index) {
      $scope.hoveredIndex = index;
  };
  $scope.leaveHover = function(index) {
      $scope.hoveredIndex = null;
  };
  $scope.hideTrack = function(index) {
    	return $scope.hoveredIndex === index || $scope.playingTrackIndex === index;
  };
  $scope.isPaused = function() {
     	return MusicPlayer.isPaused();
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
    $scope.listener();
		$scope.togglePlay = false;
  };
	$scope.nextSong = function() {
        MusicPlayer.nextSong();
        $scope.playingTrackIndex++;
        if ($scope.playingTrackIndex >= $scope.album.songs.length) {
        		$scope.playingTrackIndex = 0;
    		}
        $scope.listener();
        $scope.togglePlay = false;
  };
  $scope.previousSong = function() {
      MusicPlayer.previousSong();
  		$scope.playingTrackIndex--;
      if ($scope.playingTrackIndex < 0) {
        	$scope.playingTrackIndex = $scope.album.songs.length - 1;
    	}
      $scope.listener();
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
              currentSoundFile.unbind("timeupdate");
	        }
	        currentlyPlayingSongNumber = songNumber;
	        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
	            formats: [ 'mp3' ],
	            preload: true
	        });
	        this.setVolume(currentVolume);
	    },
    	setVolume: function(volume) {
        currentVolume = volume;
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
          return currentSoundFile.getDuration();
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
 //            var element = $('.seek-control .seek-bar');
 //            updateSeekPercentage(element, seekBarFillRatio);
 //            setCurrentTimeInPlayerBar(this.getTime());
 //            resetSong();
 //        });
 //    }
 // };
 // var updateSeekPercentage = function(element, seekBarFillRatio) {
 //    var offsetXPercent = seekBarFillRatio * 100;
 //    offsetXPercent = Math.max(0, offsetXPercent);
 //    offsetXPercent = Math.min(100, offsetXPercent);
 //    var percentageString = offsetXPercent + '%';
 //    element.find('.fill').width(percentageString);
 //    element.find('.thumb').css({left: percentageString});
 // };

     return {
         templateUrl: 'templates/slider.html',
         restrict: 'E',
         replace: true,
         scope: { 
            value: '='
         },
         controller: function($scope) {


         },
         link: function(scope, element, attributes) {

             function outerWidth(el) {
               var width = el.offsetWidth;
               var style = getComputedStyle(el);

               width += parseInt(style.marginLeft) + parseInt(style.marginRight);
               return width;
             };

             scope.fillStyles = {width:0};

             scope.jump = function (event) {
                // if (currentlyPlayingSongNumber === null) {
                //     return;
                // }
                var offsetX = event.pageX - (element[0].getBoundingClientRect().left + document.body.scrollLeft);
                var seekBarFillRatio = offsetX / outerWidth(element[0]);
                console.log(seekBarFillRatio);
                scope.fillStyles = {width: 100 * seekBarFillRatio + '%'};
                console.log(scope.fillStyles);
                scope.thumbStyles = {left: scope.fillStyles.width};
                scope.value = seekBarFillRatio * 100;
                // if (element.parent().attr('class') == 'seek-control') {
                //     seek(seekBarFillRatio * currentSoundFile.getDuration());
                //     }
                // else{
                //     setVolume(seekBarFillRatio * 100);
                // }
                // updateSeekPercentage(element, seekBarFillRatio);
            };
            // element.bind('mousedown', function () {
            //     $(document).bind('mousemove.thumb', function(event){
            //     var offsetX = event.pageX - element.offset().left;
            //     var barWidth = element.width();
            //     var seekBarFillRatio = offsetX / barWidth;
            //     if (currentlyPlayingSongNumber === null) {
            //         return;
            //     }
            //     if (element.parent().attr('class') == 'seek-control') {
            //         seek(seekBarFillRatio * currentSoundFile.getDuration()); 
            //     }
            //     else{
            //        setVolume(seekBarFillRatio);
            //     }
            //     updateSeekPercentage(element, seekBarFillRatio);
            //     });
            //     $(document).bind('mouseup.thumb', function() {
            //     $(document).unbind('mousemove.thumb');
            //     $(document).unbind('mouseup.thumb');
            //     });
            // });
         }
     };
 })
.filter('filterTime', function() {

    return function(timeInSeconds) {
      var time = parseFloat(timeInSeconds);
      if (isNaN(time)) {return '0:00'}

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
