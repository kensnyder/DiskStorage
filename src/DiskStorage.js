/**
 * @class DiskStorage
 */
(function(global) {
	
	"use strict";
	
	// provider is the object that provides localStorage, sessionStorage, and JSON
	// It is window for IE8+; otherwise it is window.DiskStorageShims
	var provider = global;
	
	/**
	 * Initialize new store
	 * 
	 * @param {String} [name]  The namespace for this store; defaults to 'default'
	 * @param {String} [engine]  "localStorage" or "sessionStorage"; defaults to "localStorage"
	 * @constructor
	 */
	function DiskStorage(name, engine) {
		this.isDirty = false;
		this.name = name || 'default';
		this.engine = engine || 'localStorage';
		var data = provider[this.engine].getItem('DSto'+this.name);
		this.data = data ? provider.JSON.parse(data) : {};
		var self = this;
		this._flush = function() { self.flush(); };
	}
	
	/**
	 * The DiskStorage version
	 * @attribute version
	 * @type String
	 * @static
	 */
	DiskStorage.version = '%VERSION%';
		
	/**
	 * True if flush should write to disk
	 * @property isDirty  
	 * @type {Boolean}
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
		 * Flush to disk (localStorage or sessionStorage)
		 * 
		 * @method flush
		 * @returns {DiskStorage}
		 * @chainable
		 */
		flush: function() {
			if (this.isDirty) {
				provider[this.engine].setItem('DSto'+this.name, provider.JSON.stringify(this.data));
				this.isDirty = false;
			}
			return this;
		},

		/**
		 * Store data for later retreival
		 *
		 * @method set
		 * @param {String} key   The name of the value
		 * @param {Any} value  The data to store
		 * @return {DiskStorage}
		 * @chainable
		 */
		set: function(key, value) {
			this.data[key] = value;
			if (!this.isDirty) {
				setTimeout(this._flush, 0);
			}
			this.isDirty = true;
			return this;
		},

		/**
		 * Get a previously stored value
		 *
		 * @method get
		 * @param {String} key  The name of the value
		 * @return {Any}
		 */
		get: function(key) {
			return this.data[key];
		},

		/**
		 * Unset a stored value
		 *
		 * @method remove
		 * @param {String} key  The name to unset
		 * @return {DiskStorage}
		 * @chainable
		 */
		remove: function(key) {
			delete this.data[key];
			if (!this.isDirty) {
				setTimeout(this._flush, 0);
			}
			this.isDirty = true;
			return this;
		},

		/**
		 * Unset all values
		 *
		 * @method clear
		 * @return {DiskStorage}
		 * @chainable
		 */
		clear: function() {
			this.data = {};
			if (!this.isDirty) {
				setTimeout(this._flush, 0);
			}
			this.isDirty = true;
			return this;
		},

		/**
		 * Iterate through the collection
		 *
		 * @method forEach
		 * @param {Function} callback  The iterator function. Will receive three parameters: value, key, this DiskStorage instance
		 * @param {Object} [thisArg]  The scope in which to execute the callback; defaults to this DiskStorage instance
		 * @return {DiskStorage}
		 * @chainable
		 */
		forEach: function(callback, thisArg) {
			for (var k in this.data) {
				if (this.data.hasOwnProperty(k)) {
					callback.call(thisArg || this, this.data[k], k, this);
				}
			}
			return this;
		},

		/**
		 * Return a copy of the data store
		 *
		 * @method exportData
		 * @return {DiskStorage}
		 */
		exportData: function() {
			return Object.clone ? Object.clone(this.data) : provider.JSON.parse(provider.JSON.stringify(this.data));
		},

		/**
		 * Replace the internal data with the one given
		 *
		 * @method load
		 * @param {Object} data  data to load
		 * @return {DiskStorage}
		 * @chainable
		 */
		load: function(data) {
			this.data = data;
			if (!this.isDirty) {
				setTimeout(this._flush, 0);
			}
			this.isDirty = true;		
			return this;
		},

		/**
		 * Return a new DiskStorage object with the same keys and values
		 *
		 * @method clone
		 * @param {String} [name]  new namespace; defaults to "default"
		 * @param {String} [engine]  "localStorage" or "sessionStorage"; defaults to the current instance's engine
		 * @return {DiskStorage}
		 */
		clone: function(name, engine) {
			name = name || 'default';
			if (name == this.name && engine == this.engine) {
				throw new Error('DiskStorage: cannot clone to same namespace');
			}
			var cloned = new DiskStorage(name, engine || this.engine);
			cloned.load(this.exportData());
			return cloned;
		},

		/**
		 * Clear the data and remove the DiskStorage data from localStorage/sessionStorage
		 * Note that the object will flush to disk if any new values are added
		 *
		 * @method destroy
		 * @return {DiskStorage}
		 * @chainable
		 */
		destroy: function() {
			provider[this.engine].removeItem('DSto'+this.name);
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
	DiskStorage.isSupported = function() {
		return provider.localStorage && 
			provider.sessionStorage &&
			provider.JSON;
	};

	// expose to window
	global.DiskStorage = DiskStorage;
	
	// attempt to use shims if needed
	if (!DiskStorage.isSupported()) {
		provider = global.DiskStorageShims;
	}

})(window);
