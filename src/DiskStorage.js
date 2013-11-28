/**
 * DiskStorage.js
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
	
	// used to throttle flush to localStorage
	var last;
	
	/**
	 * Initialize new store
	 * 
	 * @param {String} [name]  The name of this store; defaults to 'default'
	 * @constructor
	 */
	function DiskStorage(name) {
		this.name = name || 'default';
		this.data = {};
		this.flush = this.flush.bind(this);
	}
	
	/**
	 * Flush to disk (localStorage)
	 * 
	 * @returns {DiskStorage}
	 */
	DiskStorage.prototype.flush = function flush() {
		if (last == 'flush') {
			// nothing changed since last flush
			return this;
		}
		last = 'flush';
		global.localStorage.setItem('DiskStorage-'+this.name, JSON.stringify(this.data));
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
		last = 'set';
		this.data[key] = value;			
		setTimeout(this.flush, 0);
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
		last = 'remove';
		delete this.data[key];
		setTimeout(this.flush, 0);
		return this;
	};

	/**
	 * Unset all values
	 *
	 * @return {DiskStorage}
	 */
	DiskStorage.prototype.clear = function clear() {
		last = 'clear';
		this.data = {};
		setTimeout(this.flush, 0);
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
		Object.keys(this.data).forEach(callback, thisArg || this);
		return this;
	};

	/**
	 * Return true if localStorage is available
	 */
	DiskStorage.isSupported = function isSupported() {
		return 'localStorage' in global && 
			!!global.localStorage && 
			global.JSON && global.JSON.parse && global.JSON.stringify &&
			Array.prototype.forEach &&
			Object.keys;
	};

	// expose to window
	global.DiskStorage = DiskStorage;

})(window);
