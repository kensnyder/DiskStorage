/**
 * diskStorage.js
 * Wrapper for localStorage that also stores non-string data by serializing via JSON and
 *   avoids name collisions with other libraries by prefixing keys with a control character
 * Copyright (c) 2010 Ken Snyder under the MIT license: http://www.opensource.org/licenses/mit-license.html
 *
 * NOTE: This library isn't for everybody. It does not support IE less than IE9
 * It does support any browser that supports localStorage including
 *		FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
 * See http://diveintohtml5.org/storage.html
 *
 * @usage
 * diskStorage.isSupported(); // true
 *
 * diskStorage.setItem("prop1", "myString");
 * diskStorage.getItem("prop1"); // "myString"
 *
 * diskStorage.setItem("prop2", 5);
 * diskStorage.getItem("prop2"); // 5
 *
 * diskStorage.setItem("prop3", {a: "alpha"});
 * diskStorage.getItem("prop3"); // {a: "alpha"}
 *
 * // close browser and visit another time: our values persist!
 * diskStorage.removeItem("prop3");
 * diskStorage.getLength(); // 2
 *
 * diskStorage.clear();
 * diskStorage.getLength(); // 0
 *
 * diskStorage.subscribe(myFunction); // myFunction will be triggerred on setItem and removeItem
 */
(function(global) {

	/**
	 * @var {String} PREFIX_KEY - Constant to use to distinguish other localStorage values from this one
	 */
	var PREFIX_KEY = '\u0001';

	/**
	 * @var {String} PREFIX_JSON - Constant to use to distinguish strings from JSON encoded strings
	 */
	var PREFIX_JSON = '\u0002';

	/**
	 * @var {Boolean} listening - Used to listen to storage event first time subscribe() is called
	 */
	var listening = false;

	/**
	 * Add event listener to window if not already
	 *
	 * @return {undefined}
	 */
	function listenOnce() {
		if (listening) {
			return;
		}
		listening = true;
		global.addEventListener('storage', function(evt) {
			if (evt.key.charAt(0) == PREFIX_KEY) {
				global.diskStorage.notify({
					key: evt.key.slice(1),
					newValue: unpack(evt.newValue),
					oldValue: unpack(evt.oldValue),
					source: evt.source,
					event: evt,
					type: evt.type,
					target: diskStorage,
					url: evt.url || evt.uri
				});
			}
		}, false);
	}

	/**
	 * Serialize value as JSON unless it is a string already
	 *
	 * @param {Any} value - Incoming object or value
	 * @return {String}
	 */
	function pack(value) {
		// if not a string, serialize to JSON
		return Object.prototype.toString.call(value) == '[object String]' ? value : JSON.stringify(value);
	}

	/**
	 * Unserialize value if needed
	 *
	 * @param {Any} value - Incoming object or value
	 * @return {String}
	 */
	function unpack(value) {
		if (value && value.charAt(0) == PREFIX_JSON) {
			// if prefixed with our special char, unserialize JSON
			value = JSON.parse(value.slice(1));
		}
	}

	/**
	 * Initialize properties
	 */
	function DiskStorage() {
		this.subscribers = [];
	}

	/**
	 * Set a value for later retreival
	 *
	 * @param {String} key   The name of the value
	 * @param {Mixed} value  Value of any type. Non string values are serialized using JSON.stringify()
	 * @return {this}
	 */
	DiskStorage.prototype.setItem = function setItem(key, value) {
		// prefix to avoid collisions with other libs
		global.localStorage.setItem(PREFIX_KEY + key, pack(value));
		return this;
	};

	/**
	 * Get a previously stored value
	 *
	 * @param {String} key  The name of the value
	 * @return {Mixed}
	 */
	DiskStorage.prototype.getItem = function getItem(key) {
		return unpack(global.localStorage.getItem(PREFIX_KEY + key));
	};

	/**
	 * Unset a stored value
	 *
	 * @param {String} key  The name to unset
	 * @return {this}
	 */
	DiskStorage.prototype.removeItem = function removeItem(key) {
		global.localStorage.removeItem(PREFIX_KEY + key);
		return this;
	};

	/**
	 * Unset all values
	 *
	 * @return {this}
	 */
	DiskStorage.prototype.clear = function clear() {
		this.forEach(function(value, key) {
			if (key.charAt(0) == PREFIX_KEY) {
				global.localStorage.removeItem(key);
			}
		});
		return this;
	};

	/**
	 * Return the number of items in the collection
	 *
	 * @return {Number}
	 */
	DiskStorage.prototype.getLength = function getLength() {
		var length = 0;
		this.forEach(function(value, key) {
			if (key.charAt(0) == PREFIX_KEY) {
				length++;
			}
		});
		return length;
	};

	/**
	 * Iterate through the collection
	 *
	 * @return {Number}
	 */
	DiskStorage.prototype.forEach = function forEach(callback, context) {
		context = context || window;
		var key;
		for (var i = 0, len = global.localStorage.length; i < len; i++) {
			key = global.localStorage.key(i);
			if (key.charAt(0) == PREFIX_KEY) {
				key = key.slice(1);
				callback.call(context, global.localStorage.getItem(key), key, this);
			}
		}
		return global.localStorage.length;
	};

	/**
	 * Subscribe a callback to get fired whenever an item is set or removed
	 *
	 * Callbacks receive an event object with the following properties:
	 *   timestamp: Date in milliseconds
	 *   target: diskStorage
	 *   key: the name of the key being changed
	 *   oldValue: the value before being changed
	 *   newValue: the new value
	 *   url: the url of the current window
	 *
	 * @param {Function} callback  The function that will be triggered
	 * @return {this}
	 */
	DiskStorage.prototype.subscribe = function subscribe(callback) {
		listenOnce();
		this.subscribers.push(callback);
		return this;
	};

	/**
	 * Remove a callback from being fired. When called with no arguments, remove all callbacks
	 *
	 * @param {Function} callback  The function to find and unsubscribe
	 * @return {this}
	 */
	DiskStorage.prototype.unsubscribe = function unsubscribe(callback) {
		var newlist = [], i = 0, fn;
		if (arguments.length > 0) {
			while ((fn = this.subscribers[i++])) {
				if (fn !== callback) {
					newlist.push(fn);
				}
			}
		}
		this.subscribers = newlist;
		return this;
	};

	/**
	 * Generally private method to trigger all callbacks
	 */
	DiskStorage.prototype.notify = function notify(evt) {
		var i = 0, fn;
		while ((fn = this.subscribers[i++])) {
			fn(evt);
		}
		return this;
	};

	/**
	 * Create a single instance
	 */
	global.diskStorage = new DiskStorage;

	/**
	 * Return true if localStorage is available
	 */
	global.diskStorage.isSupported = function isSupported() {
		// from http://diveintohtml5.org/storage.html
		try {
			return 'localStorage' in global && !!global.localStorage && JSON && JSON.parse && JSON.stringify;
		}
		catch (e) {
			return false;
		}
	};

})(this);
