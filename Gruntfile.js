'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			src: {
				options: {
					"curly": true,
					"eqnull": true,
					"eqeqeq": false,
					"undef": true,
					"unused": false,
					"laxbreak": true,
					"browser": true,
					"globals": {
						"console": true,
						"define": true
					}
				},
				src: ['src/**/*.js']
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		uglify: {
			dist: {
				src: './src/diskStorage.js',
				dest: './dist/diskStorage.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.*'],
				tasks: ['jshint', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'uglify']);

};
