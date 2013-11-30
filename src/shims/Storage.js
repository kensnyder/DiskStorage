(function(global, shims) {

	"use strict";

	if ('localsStorage' in global && !!global.localStorage) {
		shims.localStorage = global.localStorage;
		shims.sessionStorage = global.sessionStorage;
		return;
	}
	
	var MAX_COOKIE_LENGTH = 4096;
	
	var Storage = function(persist) {
		this.persist = !!persist;
	};
	
	// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
	Storage.prototype = {
		getItem: function(sKey) {
			return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		setItem: function(sKey, sValue) {
			var newVal = escape(sKey) + "=" + escape(sValue) + "; " + (this.persist ? "expires=Tue, 19 Jan 2038 03:14:07 GMT; " : "") + "path=/";
			if (newVal.length > MAX_COOKIE_LENGTH) {
				throw new Error("DiskStorage value to long to store as cookie.");
			}
			document.cookie = newVal;
		},
		removeItem: function(sKey) {
			document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		}
	};
	
	shims.localStorage = new Storage(true);
	shims.sessionStorage = new Storage();

})(window, DiskStorageShims);
