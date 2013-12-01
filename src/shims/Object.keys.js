if (!Object.keys) {
	shims.Object.keys = function(o) {
		var i = 0;
		var keys = [];
		for (var k in o) {
			if (o.hasOwnProperty(k)) {
				keys[i++] = k;
			}
		}
		return keys;
	};
}