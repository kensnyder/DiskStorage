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
			},
			ie8: {
				src: './dist/DiskStorage.ie8.min.js',
				dest: './dist/DiskStorage.ie8.min.js'
			},
			ie6to8: {
				src: './dist/DiskStorage.ie6-8.min.js',
				dest: './dist/DiskStorage.ie6-8.min.js'
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
	
	grunt.registerTask('build', function() {
		var base = 'window.DiskStorageShims = {};';
		var ie8 = '';
		ie8 += grunt.file.read('src/shims/Function.bind.js');
		ie8 += grunt.file.read('src/shims/Object.keys.js');
		var ie6and7 = '';
		ie6and7 += grunt.file.read('src/shims/JSON.js');
		ie6and7 += grunt.file.read('src/shims/Storage.js');		
		grunt.file.write('dist/DiskStorage.ie8.min.js', base + ie8);
		grunt.file.write('dist/DiskStorage.ie6-8.min.js', base + ie8 + ie6and7);
		grunt.task.run('uglify');
	});

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'build']);

};
