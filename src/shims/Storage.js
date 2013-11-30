(function(global, shims) {

	"use strict";

	if (global.localStorage && global.sessionStorage) {
		shims.localStorage = global.localStorage;
		shims.sessionStorage = global.sessionStorage;
		return;
	}
	
	var MAX_COOKIE_LENGTH = 4096;
	
	var Storage = function(persist) {
		this.suffix = (persist ? 'p' : '');
		this.keys = {};
	};
	
	// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
	Storage.prototype = {
		getItem: function(sKey) {
			var value = unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey + this.suffix).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
			alert(sKey + ' => ' + value);
			return value;
		},
		setItem: function(sKey, sValue) {
			this.keys[sKey] = {};
			var newVal = escape(sKey + this.suffix) + "=" + escape(sValue) + "; " + (this.suffix == 'p' ? "expires=Tue, 19 Jan 2038 03:14:07 GMT; " : "") + "path=/";
			if (newVal.length > MAX_COOKIE_LENGTH) {
				throw new Error("DiskStorage value too long to store as cookie.");
			}
			document.cookie = newVal;
		},
		removeItem: function(sKey) {
			delete this.keys[sKey];
			document.cookie = escape(sKey + this.suffix) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		},
		clear: function() {
			for (var k in this.keys) {
				if (this.keys.hasOwnProperty(k)) {
					this.removeItem(k);
				}
			}
			this.keys = {};
		}
	};
	
	shims.localStorage = new Storage(true);
	shims.sessionStorage = new Storage();

})(window, DiskStorageShims);
