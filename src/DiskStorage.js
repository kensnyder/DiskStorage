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
	
	/**
	 * Flush to disk (localStorage)
	 * 
	 * @returns {DiskStorage}
	 */
	DiskStorage.prototype.flush = function flush() {
		if (this.isDirty) {
			global.localStorage.setItem('DiskStorage-'+this.name, JSON.stringify(this.data));
			this.isDirty = false;
		}
		return this;
	};

	/**
	 * Store data for later retreival
	 *
	 * @param {String} key   The name of the value
	 * @param {Any} value  The data to store
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.set = function set(key, value) {
		this.data[key] = value;
		if (!this.isDirty) {
			setTimeout(this.flush, 0);
		}
		this.isDirty = true;
		return this;
	};

	/**
	 * Get a previously stored value
	 *
	 * @param {String} key  The name of the value
	 * @return {Any}
	 */
	DiskStorage.prototype.get = function get(key) {
		return this.data[key];
	};

	/**
	 * Unset a stored value
	 *
	 * @param {String} key  The name to unset
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.remove = function remove(key) {
		delete this.data[key];
		if (!this.isDirty) {
			setTimeout(this.flush, 0);
		}
		this.isDirty = true;
		return this;
	};

	/**
	 * Unset all values
	 *
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.clear = function clear() {
		this.data = {};
		if (!this.isDirty) {
			setTimeout(this.flush, 0);
		}
		this.isDirty = true;
		return this;
	};

	/**
	 * Return the number of items in the collection
	 *
	 * @return {Number}
	 */
	DiskStorage.prototype.size = function size() {
		return Object.keys(this.data).length;
	};
	
	/**
	 * Iterate through the collection
	 *
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.forEach = function forEach(callback, thisArg) {
		callback = callback.bind(thisArg || this);
		for (var k in this.data) {
			if (this.data.hasOwnProperty(k)) {
				callback(this.data[k], k, this);
			}
		}
		return this;
	};
	
	/**
	 * Return a copy of the data store
	 *
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.export = function xport() {
		return Object.clone ? Object.clone(this.data) : JSON.parse(JSON.stringify(this.data));
	};
	
	/**
	 * Replace the internal data with the one given
	 *
	 * @param {Object} data  data to load
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.load = function load(data) {
		this.data = data;
		if (!this.isDirty) {
			setTimeout(this.flush, 0);
		}
		this.isDirty = true;		
		return this;
	};
	
	/**
	 * Return a new DiskStorage object with the same keys and values
	 *
	 * @param {String}  new namespace
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.clone = function clone(name) {
		name = name || 'default';
		if (name == this.name) {
			throw new Error('DiskStorage: cannot clone to same namespace');
		}
		var cloned = new DiskStorage(name);
		cloned.load(this.export());
		return cloned;
	};

	/**
	 * Return true if localStorage is available
	 */
	DiskStorage.isSupported = function isSupported() {
		return 'localStorage' in global && 
			!!global.localStorage && 
			global.JSON && global.JSON.parse && global.JSON.stringify &&
			Function.prototype.bind &&
			Object.keys;
	};

	// expose to window
	global.DiskStorage = DiskStorage;

})(window);
