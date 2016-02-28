module.exports = function (grunt) {
    var jsVenderSourceFiles = [
        //jquery
        'bower_components/jquery/dist/jquery.min.js',
        // Angular
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-animate/angular-animate.js'];
        
        var jsAppSourceFiles = [
        'public/js/app.js',
        'public/js/controllers/*.js',
        'public/js/controllers/**/*.js',
        'public/js/services/*.js',
       ];
       var cssFiles = [
        'public/css/main.css'
    ];
 
    grunt.initConfig({
                copy: {
                                index: {
                src: 'index.html',
                dest: 'dist/',
                cwd: 'public/',
                expand: true
            },

                },
        concat: {
            debugJs: {
                options: {
                    separator: '\r\n',
                },
                src: (jsVenderSourceFiles.concat(jsAppSourceFiles)),
                dest: 'dist/js/bundle.js'
            },
            debugCss: {
                options: {
                    separator: '\r\n',
                },
                src: cssFiles,
                dest: 'dist/css/bundle.css'
            }
           
        },
        
        less: {
            compile: {
                options: {

                },
                files: {
                    'public/css/main.css': 'public/css/main.less'
                }
            }
        },
        jshint: {
            files: {
                src: [
                    'gruntfile.js',
                    'public/js/**/*.js'
                ]
            },
            options: {
                ignores: [
                ]
            }
        },
        watch: {
            files: ['public/**/*.js', 'public/**/*.less', 'public/**/*.html', 'public/**/*.png', 'public/**/*.svg'],
            tasks: ['build-debug'],
            options: {
                interrupt: true,
            }
        },

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('build-debug', ['jshint', 'less:compile', 'concat:debugJs', 'concat:debugCss', 'copy']);

    grunt.registerTask('default', ['build-debug']);

};