#Bloc Jams Angular

Bloc Jams is an SPA designed in Bloc's [Frontend Web Development Course](https://www.bloc.io/frontend-development-bootcamp).
This is a refactor of Bloc Jams from jQuery to AngularJS. I created Bloc Jams in JavaScript, then refactored in jQuery, and last in AngularJS for learning purposes.
The original Bloc Jams can be found at my [Bloc Jams Repo.](https://github.com/EricSSartorius/bloc-jams) 

###About

For my first assignment at Bloc, I was to create a simple SPA like Spotify that has the ability to play music.
Since the main focus was on functionality, the images were given to us ahead of time, only one album (Colors) can be played, and the a mockup was pre-determined.

UI-Router is used for seemless transition between the landing, collection, and album views.
After setting up the landing page and collection views, most time was spent creating and setting up the album view. This was done by using a directive for the player bar and a factory for most of the song playing logic. 

Currently, a json is used for the CD information. However, with connection to an API such as spotify, many more albums could be added to the collection view and played in the album view.

##Built With

- Grunt
- AngularJS

The [AngularJS version](https://bloc-jams-angularjs.herokuapp.com/landing) of Bloc Jams has been deployed but is no longer maintained.


