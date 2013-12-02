<%- pkg.name %>
=

Version <%- pkg.version %>, <%- grunt.template.today("mmm yyyy") %>, MIT License

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
-

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