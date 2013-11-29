if (!DiskStorage.isSupported()) {
	console.error('This browser does not support diskStorage because it doesn\'t support localStorage or JSON.');
}

localStorage.clear();

test('set(), get(), size()', function() {
	
	var store = new DiskStorage();

	store.set('Number', 1);
	store.flush();
	strictEqual(localStorage.getItem('DiskStorage-default'), '{"Number":1}', 'storing a number');
	strictEqual(store.get('Number'), 1);
	
	store.set('Boolean', true);
	store.flush();
	deepEqual(JSON.parse(localStorage.getItem('DiskStorage-default')), {"Number":1,"Boolean":true}, 'storing a boolean');
	
	store.set('Array', [1,2,3]);
	store.flush();
	deepEqual(JSON.parse(localStorage.getItem('DiskStorage-default')), {"Number":1,"Boolean":true,"Array":[1,2,3]}, 'storing an array');
	
	store.set('String', 'abc');
	store.flush();
	deepEqual(JSON.parse(localStorage.getItem('DiskStorage-default')), {"Number":1,"Boolean":true,"Array":[1,2,3],"String":"abc"}, 'storing a string');
	
	strictEqual(store.size(), 4, 'size()');
});

test('storage is shared between instances', function() {
	var store = new DiskStorage();

	strictEqual(store.get('Number'), 1);
});

test('different namespace is separate', function() {
	var store = new DiskStorage('1');
	strictEqual(store.get('Number'), undefined, 'value from previous storage not set');
});

test('remove()', function() {
	
	var store = new DiskStorage('2');
	
	store.set('null', null);
	store.flush();
	strictEqual(localStorage.getItem('DiskStorage-2'), '{"null":null}', 'storing null');
	store.remove('null');
	store.flush();
	strictEqual(localStorage.getItem('DiskStorage-2'), '{}', 'empty after removing item');
	
});
	
test('clear()', function() {
	
	var store = new DiskStorage('2');
	
	store.set('String', 'foo');
	store.set('Object', {a:1});
	store.flush();
	deepEqual(JSON.parse(localStorage.getItem('DiskStorage-2')), {String:"foo",Object:{a:1}}, 'before clearing');
	
	store.clear();
	store.flush();
	strictEqual(localStorage.getItem('DiskStorage-2'), '{}', 'after clearing');
	
});

test('export(), forEach()', function() {
	
	var store = new DiskStorage('3');
	store.set('a', 1);
	store.set('b', 2);
	
	var vals = {};
	store.forEach(function(val, key) {
		vals[key+'!'] = val;
	});
	
	deepEqual(vals, {'a!':1,'b!':2}, 'using forEach');
	
	var data = store.export();
	deepEqual(data, {a:1,b:2}, 'export captures all data');
	
	data.c = 3;
	deepEqual(data, {a:1,b:2,c:3});
	
	deepEqual(store.export(), {a:1,b:2}, 'export does not export a reference');

});
	