module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['src/*.js'],
        dest: 'dist/metaphrase.js',
      }
    },
    uglify: {
      build: {
        files: {
          'dist/metaphrase.min.js': ['dist/metaphrase.js']
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/**/*',
        tasks: ['jscs', 'jshint'],
        options: {
          interrupt: false,
        }
      }
    },
    jscs: {
      src: ['src/**/*.js'],
      options: {
        config: '.jscsrc',
        fix: true,
        force: true,
        esnext: true,
        verbose: false
      }
    },
    jshint: {
      allFiles: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js'],
        options: {
          destination: 'doc'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jscs', 'jshint']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('+w', ['jscs', 'jshint', 'watch']);
  grunt.registerTask('build', ['jscs', 'jshint', 'doc',
    'concat', 'uglify'
  ]);
};
