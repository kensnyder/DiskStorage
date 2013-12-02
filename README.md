# DiskStorage

Version 2.0.0, Dec 2013, MIT License

[Download](https://github.com/kensnyder/DiskStorage/blob/master/dist/DiskStorage.min.js?raw=true), [Unit tests](http://sandbox.kendsnyder.com/DiskStorage/test/evergreen.html), [Online Documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/classes/DiskStorage.html)

## Features

* Less than 1 KB gzipped
* Supports IE8+, FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
* Also supports IE6 and IE7 via the included shim for data up to about 3.5KB
* Simple abstraction for saving all types of data to disk. (Data must be serializeable via JSON)
* Flushes to disk at end of event loop to avoid slowdowns when saving lots of data

**Include:**

```html
<script src="/js/DiskStorage.min.js"></script>
```

**Use:**

```javascript
var store = new DiskStorage('mystore','localStorage');

store.set("prop1", "myString");
store.get("prop1"); // "myString"

store.set("prop2", 5);
store.get("prop2"); // 5

store.set("prop3", {"a":"alpha"});
store.get("prop3"); // {"a":"alpha"}

store.remove("prop2");
store.exportData(); // {"prop1":"myString","prop3":{"a":"alpha"}}
```

## Quick Documentation

For full documentation, see [the YUIDoc documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/classes/DiskStorage.html)		

### Instance Methods

<table>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>get</strong>(key)
		<br />
		<strong>@param</strong> {String} key The name of the value
	</td>
	<td>
		{Any} 
	</td>
	<td>
		Get a previously stored value
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>flush</strong>()
		<br />
		
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Flush to disk (localStorage or sessionStorage)
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>set</strong>(key, value)
		<br />
		<strong>@param</strong> {String} key The name of the value<strong>@param</strong> {Any} value The data to store
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Store data for later retreival
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>remove</strong>(key)
		<br />
		<strong>@param</strong> {String} key The name to unset
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Unset a stored value
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
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
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>forEach</strong>(callback[, thisArg])
		<br />
		<strong>@param</strong> {Function} callback The iterator function. Will receive three parameters: value, key, this DiskStorage instance<strong>@param</strong> {Object} [thisArg] The scope in which to execute the callback; defaults to this DiskStorage instance
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Iterate through the collection
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>exportData</strong>()
		<br />
		
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Return a copy of the data store
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>load</strong>(data)
		<br />
		<strong>@param</strong> {Object} data data to load
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Replace the internal data with the one given
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
	<tr>
	<td>
		<strong>clone</strong>([name][, engine])
		<br />
		<strong>@param</strong> {String} [name] new namespace; defaults to &quot;default&quot;<strong>@param</strong> {String} [engine] &quot;localStorage&quot; or &quot;sessionStorage&quot;; defaults to the current instance&#x27;s engine
	</td>
	<td>
		{DiskStorage} 
	</td>
	<td>
		Return a new DiskStorage object with the same keys and values
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
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
Note that the object will flush to disk if any new values are added
	</td>
</tr>

<tr>
	<tr>
		<th>Signature</th>
		<th>Returns</th>
		<th>Description</th>
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

**Version 2.0.0, December 2013**
* Robust version

**Version 1.0, 2012**
* Initial version
