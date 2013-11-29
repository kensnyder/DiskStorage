/**
 * DiskStorage.js
 * v. 2.0.0
 * Wrapper for localStorage that also stores non-string data by serializing via JSON
 * Copyright (c) 2013 Ken Snyder under the MIT license: http://www.opensource.org/licenses/mit-license.html
 *
 * Supports IE9+, FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
 *
 * @usage
 * DiskStorage.isSupported(); // true
 * 
 * var store = new DiskStorage('mystore');
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
	 * @param {String} [name]  The name of this store; defaults to 'default'
	 * @constructor
	 */
	function DiskStorage(name) {
		this.isDirty = false;
		this.name = name || 'default';
		var data = global.localStorage.getItem('DiskStorage-'+this.name);
		this.data = data ? JSON.parse(data) : {};
		this.flush = this.flush.bind(this);
	}
	
	DiskStorage.prototype = {
		/**
		 * Flush to disk (localStorage)
		 * 
		 * @method flush
		 * @returns {DiskStorage}
		 */
		flush: function() {
			if (this.isDirty) {
				global.localStorage.setItem('DiskStorage-'+this.name, JSON.stringify(this.data));
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
		 * @return {DiskStorage}
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
		 * @param {String}  new namespace
		 * @return {DiskStorage}
		 */
		clone: function(name) {
			name = name || 'default';
			if (name == this.name) {
				throw new Error('DiskStorage: cannot clone to same namespace');
			}
			var cloned = new DiskStorage(name);
			cloned.load(this.export());
			return cloned;
		}
	};

	/**
	 * Return true if localStorage and JSON is available
	 */
	DiskStorage.isSupported = function() {
		return 'localStorage' in global && 
			!!global.localStorage && 
			global.JSON && global.JSON.parse && global.JSON.stringify &&
			Function.prototype.bind &&
			Object.keys;
	};

	// expose to window
	global.DiskStorage = DiskStorage;

})(window);
