<%- pkg.name %>
=

Version <%- pkg.version %>, <%- grunt.template.today("mmm yyyy") %>, MIT License

[Download](https://github.com/kensnyder/DiskStorage/blob/master/dist/DiskStorage.min.js?raw=true), [Unit tests](http://sandbox.kendsnyder.com/DiskStorage/test/evergreen.html), [Online Documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/classes/DiskStorage.html)

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

For full documentation, see [the YUIDoc documentation](http://sandbox.kendsnyder.com/DiskStorage/docs/classes/DiskStorage.html)		

Instance Methods
--

<table>
<% _.forEach(methods, function(method) { %>
<tr>
	<td>
		<strong><%- method.name %></strong>(<% _.forEach(method.params || [], function(param, i) { %><% if (param.optional) { %>[<% } %><% if (i !== 0) { %>, <% } %><%- param.name %><% if (param.optdefault !== undefined) { %>=<%- param.optdefault %><% } %><% if (param.optional) { %>]<% } %><% }); %>)<br />
		<%- method.description %><% if (_.size(method.params) > 0) { %><br /><% } %>
		<% _.forEach(method.params || [], function(param, i) { %><strong>@param</strong> {<%- (param.type || '').replace('JQuery','jQuery') %>} <% if (param.optional) { %>[<% } %><%- param.name %><% if (param.optdefault !== undefined) { %>=<%- param.optdefault %><% } %><% if (param.optional) { %>]<% } %> <%- param.description %><% }); %><br />
		<strong>@return</strong> <% if (method.return) { %>{<%- (method.return.type || '').replace('JQuery','jQuery') %>} <%- method.return.description %><% } else { %>{undefined}<% } %>
	</td>
</tr>
<% }); %>
</table>

Instance Properties
--

<table>
	<tr>
		<th>Type</th>
		<th>Name</th>
		<th>Description</th>
	<tr>
	<% _.forEach(properties, function(prop) { %><tr>
		<td>{<%- (prop.type || '').replace('JQuery','jQuery')%>}</td>
		<td><strong><%- prop.name %></strong></td>
		<td><%- prop.description %></td>
	</tr>
	<% }); %>
</table>

Changelog
-

**Version 2.0.0, December 2013**
* Robust version

**Version 1.0, 2012**
* Initial version
