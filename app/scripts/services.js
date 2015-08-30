angular.module("services", [])
.factory('MusicPlayer', function() {

    var currentAlbum = null;
    var currentlyPlayingSongNumber = null;
    var currentSongFromAlbum = null;
    var currentSoundFile = null;
    var currentSongDuration = null;
    var currentVolume = 80;
    return {

    	setSong: function(songNumber) {
    	    if (currentSoundFile) {
    	        currentSoundFile.stop();
    	    }
    	    currentlyPlayingSongNumber = songNumber;
    	    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    	    currentSongDuration = currentSongDurations[songNumber - 1];
    	    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    	        formats: [ 'mp3' ],
    	        preload: true
    	    });
    	    setVolume(currentVolume);
    	},
        trackIndex: function(album, song) {
            return album.songs.indexOf(song);
        },
        resetSong: function(){
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
        },
    	setVolume: function(volume) {
        	if (currentSoundFile) {
            	currentSoundFile.setVolume(volume);
         	}
     	},
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
        togglePlayFromPlayerBar: function(){
                if (currentlyPlayingSongNumber === null){
                    return nextSong();
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
            this.playing = false;
            currentSoundFile.pause();
        },
        play: function() {
            this.playing = true;
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
    		setSong(currentSongIndex + 1);
    		currentSoundFile.play();
    		updateSeekBarWhileSongPlays();
    		updatePlayerBarSong();
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
        	setSong(currentSongIndex + 1);
        	currentSoundFile.play();
        	updateSeekBarWhileSongPlays();
        	updatePlayerBarSong();
        	var lastSongNumber = getLastSongNumber(currentSongIndex);
        }
    };
});
 