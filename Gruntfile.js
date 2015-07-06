module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: 'src/*',
        tasks: ['jscs', 'jshint'],
        options: {
          interrupt: false,
        }
      }
    },
    jscs: {
      src: ['src/*.js'],
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
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('default', ['jscs', 'jshint']); //test
  grunt.registerTask('+w', ['jscs', 'jshint', 'watch']); //test
  grunt.registerTask('build', ['jscs']);
};
