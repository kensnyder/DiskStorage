/**
 * DiskStorage.js
 * v. 2.0.0
 * Wrapper for localStorage that sessionStorage that stores non-string data by serializing via JSON
 * Copyright (c) 2013 Ken Snyder under the MIT license: http://www.opensource.org/licenses/mit-license.html
 *
 * Supports IE9+, FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
 *
 * @usage
 * DiskStorage.isSupported(); // true
 * 
 * var store = new DiskStorage('mystore','localStorage');
 * 
 * store.set("prop1", "myString");
 * store.get("prop1"); // "myString"
 *
 * store.set("prop2", 5);
 * store.get("prop2"); // 5
 *
 * store.set("prop3", {a: "alpha"});
 * store.get("prop3"); // {a: "alpha"}
 *
 * store.remove("prop3");
 * store.size(); // 2
 *
 * store.clear();
 * store.size(); // 0
 *
 */
(function(global) {
	
	"use strict";
	
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
		var data = global[this.engine].getItem('DiskStorage-'+this.name);
		this.data = data ? JSON.parse(data) : {};
		this.flush = this.flush.bind(this);
	}
	
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
				global[this.engine].setItem('DiskStorage-'+this.name, JSON.stringify(this.data));
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
				setTimeout(this.flush, 0);
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
				setTimeout(this.flush, 0);
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
				setTimeout(this.flush, 0);
			}
			this.isDirty = true;
			return this;
		},

		/**
		 * Return the number of items in the collection
		 *
		 * @method size
		 * @return {Number}
		 */
		size: function() {
			return Object.keys(this.data).length;
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
			callback = callback.bind(thisArg || this);
			for (var k in this.data) {
				if (this.data.hasOwnProperty(k)) {
					callback(this.data[k], k, this);
				}
			}
			return this;
		},

		/**
		 * Return a copy of the data store
		 *
		 * @method export
		 * @return {DiskStorage}
		 */
		export: function() {
			return Object.clone ? Object.clone(this.data) : JSON.parse(JSON.stringify(this.data));
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
				setTimeout(this.flush, 0);
			}
			this.isDirty = true;		
			return this;
		},

		/**
		 * Return a new DiskStorage object with the same keys and values
		 *
		 * @method clone
		 * @param {String} [name]  new namespace
		 * @param {String} [engine]  "localStorage" or "sessionStorage"; defaults to "localStorage"
		 * @return {DiskStorage}
		 */
		clone: function(name, engine) {
			name = name || 'default';
			if (name == this.name && engine == this.engine) {
				throw new Error('DiskStorage: cannot clone to same namespace');
			}
			var cloned = new DiskStorage(name, engine || this.engine);
			cloned.load(this.export());
			return cloned;
		},

		/**
		 * entirely remove the data from localStorage or sessionStorage
		 *
		 * @method destroy
		 * @return {DiskStorage}
		 * @chainable
		 */
		destroy: function() {
			global[this.engine].removeItem('DiskStorage-'+this.name);
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
		return 'localStorage' in global && 
			!!global.localStorage && 
			'sessionStorage' in global &&
			!!global.sessionStorage &&
			global.JSON && JSON.parse && JSON.stringify &&
			Function.prototype.bind &&
			Object.keys;
	};

	// expose to window
	global.DiskStorage = DiskStorage;

})(window);
