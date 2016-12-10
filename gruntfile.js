module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //minimize js
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'dev/js',
                    src: '**/*.js',
                    dest: 'dist/js'
                        //'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                        //                    'dist/js/*.min.js': ['dev/js/*.js']
                }]
            }
        },

        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'dist/index.html': 'dev/index.html' // 'destination': 'source'
                }
            }
        },

        cssmin: {
            minify: {
                files: [{
                    expand: true,
                    cwd: 'dev/css',
                    src: '**/*.css',
                    dest: 'dist/css',
                    // ext: '.min.css'
                }]
            }
        },

        // gzip assets 1-to-1 for production
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'dist',
                src: ['*.html', 'css/*.css', 'js/*.js'],
                dest: 'dist'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['uglify', 'cssmin', 'htmlmin']);

    /*
    npm install grunt - contrib - uglify--save - dev
    npm install grunt - contrib - cssmin--save - dev
    npm install grunt - contrib - htmlmin--save - dev
    npm install grunt - contrib - compress--save - dev    */
};
