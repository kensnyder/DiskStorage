'use strict';

module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		pkg: pkg,
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> -' +
		' <%= grunt.template.today("mmm yyyy") %>, <%= pkg.homepage %>' +
		' - Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
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
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				src:  './src/diskStorage.js',
				dest: './dist/diskStorage.min.js'
			},
			shims: {
				src:  './dist/DiskStorage.shims.min.js',
				dest: './dist/DiskStorage.shims.min.js'
			}
		},
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: ['src'],
					outdir: 'docs'
				}
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
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('shims', 'Generate shims for ie6-7', function() {
		// build file with shims for ie6-7
		var tpl = grunt.file.read('src/shims/template.js');
		var ie6and7 = '';
		// ie 6 and 7 also need JSON and localStorage/sessionStorage
		ie6and7 += grunt.file.read('src/shims/JSON.js');
		ie6and7 += grunt.file.read('src/shims/Storage.js');		
		grunt.file.write('dist/DiskStorage.shims.min.js', tpl.replace('// SHIMS HERE', ie6and7));
	});
	
	grunt.registerTask('logo', 'Copy logo to yuidoc files', function() {
		grunt.file.copy('logo.png', 'docs/assets/css/logo.png');
	});
	
	// custom tasks	
	function extractDocs(data) {
		var docs = {
			pkg: pkg,
			properties: [],
			methods: [],
			staticProperties: [],
			staticMethods: [],
			options: []
		};
		docs.constructor = data.classes.DiskStorage;
		data.classitems.sort(alphabetic).forEach(function(item) {
			if (item.itemtype == 'property' && item.name == 'options') {
				docs.options = item.subprops;
			}
			else if (item.itemtype == 'method') {
				docs.methods.push(item); 
			}
			else if (item.itemtype == 'property') {
				docs.properties.push(item); 
			}
			else if (item['static'] && item.itemtype == 'method') {
				docs.staticMethods.push(item); 
			}
			else if (item['static'] && item.itemtype == 'property') {
				docs.staticProperties.push(item); 
			}
		});
		// remove yuidoc crossLink mustache tags
		var docStr = JSON.stringify(docs).replace(/\{\{.+?\}\}(.+?)\{\{.+?\}\}/g, '$1');
		docs = JSON.parse(docStr);
		return docs;
	}
	
	function alphabetic(a, b) {
		if (!a.name || !b.name) {
			return 0;
		}
		var nameA = a.name.substring(0,1) == '_' ? 'zzz' + a.name : a.name;
		var nameB = b.name.substring(0,1) == '_' ? 'zzz' + b.name : b.name;
		return nameA == nameB ? 0 : (nameA > nameB ? 1 : -1);
	}
	
	grunt.registerTask('readme', 'Compile the README based on source documentation', function() {
		var tpl = grunt.file.read('src/README.md');
		var docData = extractDocs( grunt.file.readJSON('docs/data.json') );
		var readme = grunt.template.process(tpl, {data:docData});
		grunt.file.write('./README.md', readme);
	});
	
	grunt.registerTask('updateVersions', 'Update version strings in files', function() {
		var js = grunt.file.read('dist/DiskStorage.min.js');
		js = js.replace('%VERSION%', pkg.version);
		grunt.file.write('dist/DiskStorage.min.js', js);
		var json = grunt.file.read('./package.json');
		json = json.replace(/("version"\s*:\s*").+?"/, '$1'+pkg.version+'"');
		grunt.file.write('./package.json', json);
	});

	// build steps
	grunt.registerTask('build', ['shims','uglify','yuidoc','logo','readme']);

	// Default task.
	grunt.registerTask('default', ['jshint', 'qunit', 'build']);

};
