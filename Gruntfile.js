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
						"alert": true,
						"define": true,
						"escape": true,
						"unescape": true,
						"DiskStorageShims": true,
						// for our shim templates to jshint, we add these two vars
						"global": true,
						"shims": true
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
				src:  './src/diskStorage.js',
				dest: './dist/diskStorage.min.js'
			},
			shims: {
				src:  './dist/DiskStorage.shims.min.js',
				dest: './dist/DiskStorage.shims.min.js'
			}
		},
		watch: {
			scripts: {
				files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.*'],
				tasks: ['jshint', 'shims', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('shims', function() {
		// build file with shims for ie6-7
		var tpl = grunt.file.read('src/shims/template.js');
		var ie6and7 = '';
		// ie 6 and 7 also need JSON and localStorage/sessionStorage
		ie6and7 += grunt.file.read('src/shims/JSON.js');
		ie6and7 += grunt.file.read('src/shims/Storage.js');		
		grunt.file.write('dist/DiskStorage.shims.min.js', tpl.replace('// SHIMS HERE', ie6and7));
	});
	
	grunt.registerTask('build', function() {
		grunt.task.run('shims');
		grunt.task.run('uglify');
	});

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'build']);

};
