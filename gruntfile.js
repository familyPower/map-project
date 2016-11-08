module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Will delete files for `dist` target
    // Will NOT delete files for `dev` target
    clean: {
      contents: ['dist'],
      dev: {
        options: {
          'no-write': true
        },
        src: ['dev']
      }
    },

    // copy folder structure and files
    copy: {
      main: {
        files: [
          // includes files within path
          //{expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

          // includes files within path and its sub-directories
          //{expand: true, src: ['dev/**'], dest: 'dist'},

          // makes all src relative to cwd
          {expand: true, cwd: 'dev/', src: ['**'], dest: 'dist/'},

          // flattens results to a single level
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },

    // rename paths to css, js, files etc.
    replace: {
          dist: {
            options: {
              patterns: [
                {
                  match: /\.css/g,
                  replacement: '.min.css'
                },
                // {
                //   match: /\.html/g,
                //   replacement: '.min.html'
                // },
                {
                  match: /[^(min)]\.js/g,
                  replacement: '.min.js'
                }
              //   {
              //     match: /(\.min){,2}/g,
              //     replacement: '.min'
              //   }
             ]
            },
          files: [
            {expand: true, flatten: false, src: ['dist/**/*.html']}
          ]
        }
      },

    //minimize js
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          //'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
          'dist/js/script.min.js': ['dist/js/script.js']
        }
      }
    },

    // // minimize images
    // imagemin: {
    //    dist: {
    //       options: {
    //         optimizationLevel: 5
    //       },
    //       files: [{
    //          expand: true,
    //          cwd: 'dev/img',
    //          src: ['**/*.{png,jpg,gif}'],
    //          dest: 'dist/img'
    //       },
    //       {
    //         expand: true,
    //         cwd: 'dev/views/images',
    //         src: ['**/*.{png,jpg,gif}'],
    //         dest: 'dist/views/images'
    //       }]
    //    }
    // },

    htmlmin: {                                     // Task
        dist: {                                      // Target
          options: {                                 // Target options
            removeComments: true,
            collapseWhitespace: true
          },
          files: {                                   // Dictionary of files
            'dist/index.html': 'dev/index.html'     // 'destination': 'source'
          }
        }
      },

    cssmin: {
      minify: {
        expand: true,
      //cwd: 'css/',
      // src: ['*.css', '!*.min.css', ],
        files: {
          'dist/css/style.min.css': ['dist/css/style.css']
          // 'dist/css/print.min.css': ['dev/css/print.css'],
          // 'dist/views/css/bootstrap-grid.min.css': ['dev/views/css/bootstrap-grid.css'],
          // 'dist/views/css/style.min.css': ['dev/views/css/style.css']
        }
      // dest: 'dist/css',
      // ext: '.min.css'
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
        src: ['*.html', 'css/*.css','js/*.js'],
        dest: 'dist'
      }
    }

});
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  // grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('test', ['copy']);
  grunt.registerTask('test2', ['clean','copy','replace']);
  grunt.registerTask('test3', ['clean','copy','replace','uglify','cssmin']);

  //grunt.registerTask('all', ['uglify', 'imagemin', 'cssmin', 'htmlmin']);

  grunt.registerTask('all', ['clean','copy','replace','uglify','imagemin','cssmin','htmlmin', 'compress']);

  // grunt.registerTask('default', ['clean','uglify','imagemin','cssmin','htmlmin','replace']);
  grunt.registerTask('default', ['clean','copy','replace','uglify','cssmin','htmlmin']);

  /*
  npm install grunt-contrib-clean --save-dev
  npm install grunt-contrib-copy --save-dev
  npm install grunt-replace --save-dev
  npm install grunt-contrib-uglify --save-dev
  npm install grunt-contrib-imagemin --save-dev
  npm install grunt-contrib-cssmin --save-dev
  npm install grunt-contrib-htmlmin --save-dev
  npm install grunt-contrib-compress --save-dev
  npm install grunt-string-replace --save-dev
  */
};
