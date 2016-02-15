module.exports = function(grunt) {

    grunt.registerTask( 'default', [ 'clean', 'uglify', 'concat_css', 'cssmin', 'copy', 'hapi', 'watch'] );

    grunt.registerTask( 'build', [ 'clean', 'uglify', 'concat_css', 'cssmin', 'copy' ] );

    grunt.registerTask( 'run', [ 'hapi', 'watch' ]);

    grunt.initConfig({

        watch: {
            hapi: {
                files: [
                    './app/assets/**/*.{png,jpg,jpeg,mp3}',
                    './app/scripts/**/*.js',
                    './app/styles/**/*.css',
                    './app/pages/**/*.html',
                    './app/templates/**/*.html',
                    'Gruntfile.js'
                ],
                tasks: [
                    'clean',
                    'uglify',
                    'concat_css',
                    'cssmin',
                    'copy'
                ],
                options: {
                    spawn: false
                }
            }
        },

        concat_css: {
            options: {
              // Task-specific options go here. 
            },
            all: {
              src: ["./app/**/*.css"],
              dest: "./app/styles/styles.css"
            },
        },

        cssmin: {
          target: {
            files: [{
              expand: true,
              cwd: 'app/styles',
              src: ['styles.css', '!*.min.css'],
              dest: 'dist/styles/min',
              ext: '.min.css'
            }]
          }
        },

        uglify: {
            my_target: {
              files: [{
                './app/scripts/min/fixtures.min.js': ['./app/scripts/fixtures.js']},
                {'./app/scripts/min/app.min.js': ['./app/scripts/app.js']
              }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    src: [ './assets/**/*.{png,jpg,jpeg,mp3}' ],
                    dest: './dist',
                    cwd: './app'
                }, {
                    expand: true,
                    src: [ './**/*.html' ],
                    dest: './dist',
                    cwd: './app/pages'
                },  {
                    expand: true,
                    src: [ './**/*.js' ],
                    dest: './dist/scripts',
                    cwd: './app/scripts'
                }, {
                    expand: true,
                    src: [ './**/*.html' ],
                    dest: './dist/templates',
                    cwd: './app/templates'
                }]
            }
        },

        hapi: {
            custom_options: {
                options: {
                    server: require('path').resolve('./server'),
                    bases: {
                        '/dist': require('path').resolve('./dist/')
                    }
                }
            }
        },

        clean: ['./dist']
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-hapi');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concat-css');

};
