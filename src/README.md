# <%- pkg.name %>

Version <%- pkg.version %>, <%- grunt.template.today("mmm yyyy") %>, MIT License

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
<% _.forEach(methods, function(method) { %>
<tr>
	<td>
		<strong><%- method.name %></strong>(<% _.forEach(method.params || [], function(param, i) { %><% if (param.optional) { %>[<% } %><% if (i !== 0) { %>, <% } %><%- param.name %><% if (param.optdefault !== undefined) { %>=<%- param.optdefault %><% } %><% if (param.optional) { %>]<% } %><% }); %>)
		<br />
		<% _.forEach(method.params || [], function(param, i) { %>{<%- (param.type || '') %>} <% if (param.optional) { %>[<% } %><%- param.name %><% if (param.optdefault !== undefined) { %>=<%- param.optdefault %><% } %><% if (param.optional) { %>]<% } %> <%- param.description %><br /><% }); %>
	</td>
	<td>
		<% if (method.return) { %>{<%- (method.return.type || '') %>} <%- method.return.description %><% } else { %>{undefined}<% } %>
	</td>
	<td>
		<%- method.description %>
	</td>
</tr>
<% }); %>
</table>

### Instance Properties

<table>
	<tr>
		<th>Type</th>
		<th>Name</th>
		<th>Description</th>
	<tr>
	<% _.forEach(properties, function(prop) { %><tr>
		<td><%- (prop.type || '')%></td>
		<td><strong><%- prop.name %></strong></td>
		<td><%- prop.description %></td>
	</tr>
	<% }); %>
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
