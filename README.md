DiskStorage
=

Version 2.0.0, Dec 2013, MIT License

[Download](https://github.com/kensnyder/DiskStorage/blob/master/dist/DiskStorage.min.js?raw=true), [Unit tests](http://sandbox.kendsnyder.com/DiskStorage/test/evergreen.html), [Online Documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/)

Features
-

* Supports IE8+, FF 3.5+, Safari 4+, Chrome 4.0+, Opera 10.50+, iPhone 2.0+, Android 2.0+
* Also supports IE6 and IE7 via the included shim for data up to about 3.5KB
* Simple abstraction for saving all types of data to disk. (Data must be serializeable via JSON)
* Flushes to disk at end of event loop to avoid slowdowns when saving lots of data

Include:

```html
<script src="/js/DiskStorage.min.js"></script>
```

Use:

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

Quick Documentation
-

For full documentation, see [the YUIDoc documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/)		

Instance Methods
-

<table>

<tr>
	<td>
		<strong>get</strong>(key)<br />
		Get a previously stored value<br />
		<strong>@param</strong> {String} key The name of the value<br />
		<strong>@return</strong> {Any} 
	</td>
</tr>

<tr>
	<td>
		<strong>flush</strong>()<br />
		Flush to disk (localStorage or sessionStorage)
		<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>set</strong>(key, value)<br />
		Store data for later retreival<br />
		<strong>@param</strong> {String} key The name of the value<strong>@param</strong> {Any} value The data to store<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>remove</strong>(key)<br />
		Unset a stored value<br />
		<strong>@param</strong> {String} key The name to unset<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>clear</strong>()<br />
		Unset all values
		<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>forEach</strong>(callback[, thisArg])<br />
		Iterate through the collection<br />
		<strong>@param</strong> {Function} callback The iterator function. Will receive three parameters: value, key, this DiskStorage instance<strong>@param</strong> {Object} [thisArg] The scope in which to execute the callback; defaults to this DiskStorage instance<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>exportData</strong>()<br />
		Return a copy of the data store
		<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>load</strong>(data)<br />
		Replace the internal data with the one given<br />
		<strong>@param</strong> {Object} data data to load<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>clone</strong>([name][, engine])<br />
		Return a new DiskStorage object with the same keys and values<br />
		<strong>@param</strong> {String} [name] new namespace; defaults to &quot;default&quot;<strong>@param</strong> {String} [engine] &quot;localStorage&quot; or &quot;sessionStorage&quot;; defaults to the current instance&#x27;s engine<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>destroy</strong>()<br />
		Clear the data and remove the DiskStorage data from localStorage/sessionStorage
Note that the object will flush to disk if any new values are added
		<br />
		<strong>@return</strong> {DiskStorage} 
	</td>
</tr>

<tr>
	<td>
		<strong>isSupported</strong>()<br />
		Return true if localStorage, sessionStorage and JSON are available
		<br />
		<strong>@return</strong> {Boolean} True if browser will support DiskStorage
	</td>
</tr>

</table>

Instance Properties
-

<table>
	<tr>
		<th>Type</th>
		<th>Name</th>
		<th>Description</th>
	<tr>
	<tr>
		<td>{Boolean}</td>
		<td><strong>isDirty  True if flush should write to disk</strong></td>
		<td></td>
	</tr>
	<tr>
		<td>{String}</td>
		<td><strong>name  The namespace of the store</strong></td>
		<td></td>
	</tr>
	<tr>
		<td>{String}</td>
		<td><strong>engine  &quot;localStorage&quot; or &quot;sessionStorage&quot;</strong></td>
		<td></td>
	</tr>
	<tr>
		<td>{Object}</td>
		<td><strong>data  The data</strong></td>
		<td></td>
	</tr>
	
</table>

Changelog
-

**Version 2.0.0, December 2013**
* Robust version

**Version 1.0, 2012**
* Initial version


Contributing
-

After using git to clone the repo, you'll need nodejs, npm, and grunt-cli installed. See [gruntjs.com](http://gruntjs.com/getting-started) for more information. Then inside the cloned directory run `npm install` and then `grunt`

Make updates only to the files in the `./src` directory. Then run `grunt` to automatically generate documentation and other files. You may also make changes to the demos by editing `./demos/*` files or improve the build process by editing `./Gruntfile.js`. Then make a pull request.


Reporting Bugs
-

To report bugs, add an issue to the [GitHub issue tracker](https://github.com/kensnyder/jQuery-Suggester/issues).


License
-

Copyright 2012-2013, Ken Snyder

[MIT License](http://www.opensource.org/licenses/mit-license.php)

Inspired by the AutoSuggest plugin by Drew Wilson