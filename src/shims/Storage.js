if (!global.localStorage) {
	
	var MAX_COOKIE_LENGTH = 4096;
	
	var Storage = function(persist) {
		this.suffix = (persist ? 'p' : '');
	};
	
	// https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
	Storage.prototype = {
		getItem: function(sKey) {
			var items = document.cookie.split('; ');
			var parts;
			var key = escape(sKey + this.suffix);
			for (var i = 0; i < items.length; i++) {
				parts = items[i].split('=');
				if (parts[0] == key) {
					return unescape(parts[1]);
				}
			}
			return null;
		},
		setItem: function(sKey, sValue) {
			var newVal = escape(sKey + this.suffix) + "=" + escape(sValue) + "; " + (this.suffix == 'p' ? "expires=Tue, 19 Jan 2038 03:14:07 GMT; " : "") + "path=/";
			if (newVal.length > MAX_COOKIE_LENGTH) {
				throw new Error("DiskStorage value too long to store as cookie.");
			}
			document.cookie = newVal;
		},
		removeItem: function(sKey) {
			document.cookie = escape(sKey + this.suffix) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		},
		clear: function() {
			var items = document.cookie.split('; ');
			var parts;
			for (var i = 0; i < items.length; i++) {
				parts = items[i].split('=');
				if (parts[0].slice(0,4) == 'DSto') {
					document.cookie = parts[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				}
			}			
		}
	};
	
	shims.localStorage = new Storage(true);
	shims.sessionStorage = new Storage();

}
