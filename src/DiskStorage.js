(function(provider) {
	
	"use strict";	
	
	/**
	 * Initialize a new store with the given options
	 * 
	 * @class DiskStorage
	 * @constructor
	 * @param {Object|String} [options]  If a string, it will be interpretted as options.name (see below)
	 * @param {String} [options.engine="localStorage"]  "localStorage" or "sessionStorage"
	 * @param {String} [options.prefix="DSto"]  The prefix for the data key that is actually stored in localStorage or sessionStorage
	 * @param {String} [options.name="default"]  The namespace that distinguishes this instance from others
	 * @param {Number} [options.flushDebounceMs=15]  The number of milliseconds delay before flushing data to disk
	 * @param {String} [options.importKey]  The name of a localStorage key to import data from if it exists
	 * @return {DiskStorage}
	 */
	function DiskStorage(options) {
		var self = this;
		self.isDirty = false;
		// v2.0 compatibility
		if (typeof options == 'string') {
			options = {name: options};
			if (typeof arguments[1] == 'string') {
				options.engine = arguments[1];
			}
		}
		options = options || {};
		// advanced options defaults
		self.name = options.name || 'default';
		self.prefix = options.prefix || 'DSto';
		self.engine = options.engine || 'localStorage';
		self.flushDebounceMs = options.flushDebounceMs || 15;
		// grab existing data
		var data = provider[this.engine].getItem(options.importKey || this.prefix+this.name);		
		this.data = data ? provider.JSON.parse(data) : {};
		if (options.importKey && this.data) {
			provider[this.engine].removeItem(options.importKey);
		}
		// setup flush and debounce
		function debounce(fn) {
			return function() {
				clearTimeout(self.flushTimeoutHandle);
				self.flushTimeoutHandle = setTimeout(fn, self.flushDebounceMs);
			};
		}		
		// flush no more often than every 15ms
		// to ensure decent performance on JSON serialization of large objects
		this._flush = debounce(function() { self.flush(); });
		// but make sure to flush before page navigation if needed
		window.addEventListener('beforeunload', function() {
			clearTimeout(self.flushTimeoutHandle);
			if (self.isDirty) {
				self.flush();
			}
		});
	}
	
	/**
	 * The DiskStorage version
	 * @attribute version
	 * @type {String}
	 * @static
	 */
	DiskStorage.version = '%VERSION%';
		
	/**
	 * True if flush should write to disk
	 * @property isDirty  
	 * @type {Boolean}
	 */
	/**
	 * The prefix for the data key that is actually stored in localStorage or sessionStorage
	 * @property prefix
	 * @type {String}  
	 */
	/**
	 * The namespace of the store
	 * @property name
	 * @type {String}  
	 */
	/**
	 * "localStorage" or "sessionStorage"
	 * @property engine
	 * @type {String}
	 */
	/**
	 * The data
	 * @property data
	 * @type {Object}
	 */
	DiskStorage.prototype = {
		
		/**
		 * Store data for later retreival
		 *
		 * @method set
		 * @param {String} key   The name of the value
		 * @param {Any} value  The data to store
		 * @return {DiskStorage}
		 * @chainable
		 */
		set: function set(key, value) {
			this.data[key] = value;
			this.isDirty = true;
			this._flush();
			return this;
		},

		/**
		 * Get a previously stored value
		 *
		 * @method get
		 * @param {String} key  The name of the value
		 * @return {Any}
		 */
		get: function get(key) {
			return this.data[key];
		},

		/**
		 * Check if a particular key has a value (even undefined)
		 *
		 * @method has
		 * @param {String} key  The name of the value
		 * @return {Boolean}
		 */
		has: function has(key) {
			return (key in this.data);
		},

		/**
		 * Unset a stored value
		 *
		 * @method remove
		 * @param {String} key  The name to unset
		 * @return {DiskStorage}
		 * @chainable
		 */
		remove: function remove(key) {
			delete this.data[key];
			this.isDirty = true;
			this._flush();
			return this;
		},

		/**
		 * Unset all values
		 *
		 * @method clear
		 * @return {DiskStorage}
		 * @chainable
		 */
		clear: function clear() {
			this.data = {};
			this.isDirty = true;
			this._flush();
			return this;
		},
		
		/**
		 * Flush to disk (localStorage or sessionStorage).
		 * Using this function is not normally necessary. Chanages to data are automatically queued for flush (in 15ms).
		 * 
		 * @method flush
		 * @returns {DiskStorage}
		 * @chainable
		 */
		flush: function flush() {
			clearTimeout(this.flushTimeoutHandle);
			provider[this.engine].setItem(this.prefix+this.name, provider.JSON.stringify(this.data));
			this.isDirty = false;
			return this;
		},

		/**
		 * Return a copy of the data store
		 * @see https://jsperf.com/cloning-an-object/2
		 *
		 * @method export
		 * @return {Object}
		 */
		export: function export_() {
			return provider.JSON.parse(provider.JSON.stringify(this.data));
		},

		/**
		 * Replace the internal data with the one given
		 *
		 * @method load
		 * @param {Object} data  data to load
		 * @return {DiskStorage}
		 * @chainable
		 */
		load: function load(data) {
			this.data = data;
			this.isDirty = true;
			this._flush();		
			return this;
		},

		/**
		 * Return a new DiskStorage object with the same keys and values
		 *
		 * @method clone
		 * @param {Object} [options]
		 * @param {String} [options.name="default"]  The namespace that distinguishes this instance from others
		 * @param {String} [options.engine="localStorage"]  "localStorage" or "sessionStorage"
		 * @param {String} [options.prefix="__DS__"]  The prefix for the data key that is actually stored in localStorage or sessionStorage
		 * @param {String} [options.flushDebounceMs=15]  The number of milliseconds delay before flushing data to disk
		 * @param {String} [options.importKey]  The name of a localStorage key to import from if it exists
		 * @return {DiskStorage}
		 */
		clone: function clone(options) {
			options = options || {};
			var cloned = new DiskStorage({
				prefix: options.prefix || this.prefix,
				name: options.name || this.name,
				engine: options.engine || this.engine
			});
			cloned.load(this.export()); // export so that each instance refers to its own object
			return cloned;
		},

		/**
		 * Clear the data and remove the DiskStorage data from localStorage/sessionStorage
		 *
		 * @method destroy
		 * @return {DiskStorage}
		 * @chainable
		 */
		destroy: function destroy() {
			provider[this.engine].removeItem(this.prefix+this.name);
			this.data = {};
			return this;
		}
		
	};

	/**
	 * Return true if localStorage, sessionStorage and JSON are available
	 * 
	 * @method isSupported
	 * @static
	 * @return {Boolean}  True if browser will support DiskStorage
	 */
	DiskStorage.isSupported = function isSupported() {
		return provider.localStorage && 
			provider.sessionStorage &&
			provider.JSON;
	};

	// expose to window
	window.DiskStorage = DiskStorage;

})(window);
