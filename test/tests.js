if (!DiskStorage.isSupported()) {
	alert('This browser does not support DiskStorage, even after polyfills.');
}

function runTests(engine) {
	
	var provider = window.DiskStorageShims || window;
	
	provider[engine].clear();
	
	module(engine);
	
	test('set(), get()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '0',
			engine: engine
		});

		store.set('Number', 1);
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto0')), {"Number":1}, 'storing a number');
		strictEqual(store.get('Number'), 1);

		store.set('Boolean', true);
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto0')), {"Number":1,"Boolean":true}, 'storing a boolean');

		store.set('Array', [1,2,3]);
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto0')), {"Number":1,"Boolean":true,"Array":[1,2,3]}, 'storing an array');

		store.set('String', 'abc');
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto0')), {"Number":1,"Boolean":true,"Array":[1,2,3],"String":"abc"}, 'storing a string');

		var store2 = new DiskStorage({
			prefix: 'DSto',
			name: '0',
			engine: engine
		});
		strictEqual(store2.get('Number'), 1, 'storage is shared between instances');
	});

	test('has()', function() {
		var store = new DiskStorage({
			prefix: 'DSto',
			name: '0',
			engine: engine
		});
		strictEqual(store.has('foo'), false, 'unset value');
		store.set('foo', false);
		strictEqual(store.get('foo'), false, 'value got set');
		strictEqual(store.has('foo'), true, 'has value even when false');
	});

	test('different namespace is separate', function() {
		var store = new DiskStorage({
			prefix: 'DSto',
			name: '1',
			engine: engine
		});
		strictEqual(store.get('Number'), undefined, 'value from previous storage not set');
	});

	test('remove()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '2',
			engine: engine
		});

		store.set('null', null);
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto2')), {"null":null}, 'storing null');
		store.remove('null');
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto2')), {}, 'empty after removing item');

	});

	test('clear()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '2',
			engine: engine
		});

		store.set('String', 'foo');
		store.set('Object', {a:1});
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto2')), {String:"foo",Object:{a:1}}, 'before clearing');

		store.clear();
		store.flush();
		deepEqual(provider.JSON.parse(provider[engine].getItem('DSto2')), {}, 'after clearing');

	});

	test('export()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '3',
			engine: engine
		});
		store.set('a', 1);
		store.set('b', 2);

		var data = store.export();
		deepEqual(data, {a:1,b:2}, 'export captures all data');

		data.c = 3;
		deepEqual(data, {a:1,b:2,c:3});

		deepEqual(store.export(), {a:1,b:2}, 'export does not export a reference');

	});

	test('clone()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '4',
			engine: engine
		});
		store.set('a', 1);
		store.set('b', 2);
		store.flush();

		deepEqual(store.export(), {a:1,b:2}, 'export captures all data');

		var store2 = store.clone('4-copy');
		deepEqual(store.engine, store2.engine, 'engine is the same');
		
		store2.flush();
		
		deepEqual(store2.export(), {a:1,b:2});

		store.set('c', 1);

		strictEqual(store.get('c'), 1, 'add item to original');
		strictEqual(store2.get('c'), undefined, 'clone keeps data separate');

	});

	test('destroy()', function() {

		var store = new DiskStorage({
			prefix: 'DSto',
			name: '4',
			engine: engine
		});
		store.destroy();

		strictEqual(provider[engine].getItem('DSto4'), null, 'no trace of data');

	});

}

runTests('localStorage');
runTests('sessionStorage');
