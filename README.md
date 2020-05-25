# DiskStorage

Version 3.0.1, Apr 2015, MIT License

[Download](https://github.com/kensnyder/DiskStorage/blob/master/dist/DiskStorage.min.js?raw=true), [Unit tests](http://sandbox.kendsnyder.com/DiskStorage-v3/test/tests.html), [Online Documentation](http://sandbox.kendsnyder.com/DiskStorage-v3/docs/classes/DiskStorage.html)

## Features

* About 0.4 kb gzipped
* Supports IE8+, FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
* Simple abstraction for saving all types of data to disk. (Data must be serializeable via JSON)
* Flushes to disk in batches to avoid performance problems with large data (localStorage and sessionStorage allow 5mb max)

**Include:**

```html
<script src="/js/DiskStorage.min.js"></script>
```

**Use:**

```javascript
// basic Usage
var store = new DiskStorage('mystore');

store.set("prop1", "myString");
store.get("prop1"); // "myString"

store.set("prop2", 5);
store.get("prop2"); // 5

store.set("prop3", {"a":"alpha"});
store.get("prop3"); // {"a":"alpha"}

store.remove("prop2");
store.exportData(); // {"prop1":"myString","prop3":{"a":"alpha"}}

// Advanced options defaults
var store2 = new DiskStorage({	
	engine: 'localStorage',
	prefix: 'DSto',
	name: 'default',
	flushDebounceMs: 15,
	importKey: undefined
}):
```

## Quick Documentation

For full documentation, see [the YUIDoc documentation](http://sandbox.kendsnyder.com/DiskStorage-v3/docs/classes/DiskStorage.html)		

### Instance Methods

<table>
<tr>
	<th align="left">Signature</th>
	<th align="left">Returns</th>
	<th align="left">Description</th>
</tr>

<tr>
	<td>
		<strong>set</strong>(key, value)
		<br />
		{String} key The name of the value<br />{Any} value The data to store<br />
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Store data for later retreival
	</td>
</tr>

<tr>
	<td>
		<strong>get</strong>(key)
		<br />
		{String} key The name of the value<br />
	</td>
	<td>
		{Any} 
	</td>
	<td>
		Get a previously stored value
	</td>
</tr>

<tr>
	<td>
		<strong>has</strong>(key)
		<br />
		{String} key The name of the value<br />
	</td>
	<td>
		{Boolean} 
	</td>
	<td>
		Check if a particular key has a value (even undefined)
	</td>
</tr>

<tr>
	<td>
		<strong>remove</strong>(key)
		<br />
		{String} key The name to unset<br />
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Unset a stored value
	</td>
</tr>

<tr>
	<td>
		<strong>clear</strong>()
		<br />
		
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Unset all values
	</td>
</tr>

<tr>
	<td>
		<strong>flush</strong>()
		<br />
		
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Flush to disk (localStorage or sessionStorage).
Using this function is not normally necessary. Changes to data are automatically queued for flush (in 15ms).
	</td>
</tr>

<tr>
	<td>
		<strong>export</strong>()
		<br />
		
	</td>
	<td>
		{Object} 
	</td>
	<td>
		Return a copy of the data store
	</td>
</tr>

<tr>
	<td>
		<strong>load</strong>(data)
		<br />
		{Object} data data to load<br />
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Replace the internal data with the one given
	</td>
</tr>

<tr>
	<td>
		<strong>clone</strong>([options])
		<br />
		{Object} [options] <br />
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Return a new DiskStorage object with the same keys and values
	</td>
</tr>

<tr>
	<td>
		<strong>destroy</strong>()
		<br />
		
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Clear the data and remove the DiskStorage data from localStorage/sessionStorage
	</td>
</tr>

<tr>
	<td>
		<strong>isSupported</strong>()
		<br />
		
	</td>
	<td>
		{Boolean} True if browser will support DiskStorage
	</td>
	<td>
		Return true if localStorage, sessionStorage and JSON are available
	</td>
</tr>

</table>

### Instance Properties

<table>
	<tr>
		<th>Type</th>
		<th>Name</th>
		<th>Description</th>
	<tr>
	<tr>
		<td>{Boolean}</td>
		<td><strong>isDirty</strong></td>
		<td>True if flush should write to disk</td>
	</tr>
	<tr>
		<td>{String}</td>
		<td><strong>prefix</strong></td>
		<td>The prefix for the data key that is actually stored in localStorage or sessionStorage</td>
	</tr>
	<tr>
		<td>{String}</td>
		<td><strong>name</strong></td>
		<td>The namespace of the store</td>
	</tr>
	<tr>
		<td>{String}</td>
		<td><strong>engine</strong></td>
		<td>&quot;localStorage&quot; or &quot;sessionStorage&quot;</td>
	</tr>
	<tr>
		<td>{Object}</td>
		<td><strong>data</strong></td>
		<td>The data</td>
	</tr>
	
</table>

## Changelog

**Version 3.0.1, April 2015**
* Made flush batching smarter
* has() function
* New advanced options
* Dropped support for IE7

**Version 2.0.0, December 2013**
* Robust version

**Version 1.0, 2012**
* Initial version
