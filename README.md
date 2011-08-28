jsTable
============
jsTable is a mootools control designed to make it easy to add serializable data tables to the page with javascript.

![ScreenShot](http://i.imgur.com/b2hU0.png)

Demo
-----
See [this page](http://popacular.com/jstable/Test/demo.html) for a demo of jsTable in action.

How to Use
----------

(This is only a summary. Please see [the documentation](https://github.com/reednj/jsTable/blob/master/Docs/jsTable.md) for a method by method description of usage)

If we have a div object in the html that looks like this:

	<div id='new-table'></div>

It can be turned into a jsTable by constructing the object and passing the element as a parameter.

	var jst = new jsTable('new-table');

Then we add some columns to the table:

	// usage: addColumn(column_name, column_description);
	jst.addColumn('filename', 'File Name');
	jst.addColumn('size'); // if the description is not given, the column name is used instead

Now data can be added to the table. Elements can be added, as well simple strings and html.

	// usage: addRow(column1, column2, ...)
	jst.addRow('test.txt', '12kb');

You can get and set the contents of the cells using the setCell, getCell functions

	var contents = jst.getCell(row_index, column_name);
	jst.setCell(row_index, column_name, contents);

Styling
-------

Use css to style the table, and the hide or show certain columns. You could hide the header by simply doing the
following.

	#new-table thead {
		display: none;
	}

The column names are applied to the table cells as css classes and can be used also. The class names are prefixed with 'jst-'

	/* hide the 'size' column */
	#new-table td.jst-size, #new-table th.jst-size  {
		display: none;
	}

These classes can also be used to set borders, font sizes, padding etc.

Serialization
-------------

You can serialize the table to a javascript object, or to a json string using the methods toJson and toData respectively.

	// set up a table with two columns
	jst = addTable('new-table);
	jst.addColumn('n1');
	jst.addColumn('n2');

	// add some rows to the table
	jst.addRow(10, 20);
	jst.addRow(30, 40);

You would get html that looks a bit like this:

	<table>
		<tr><td class='jst-n1'>10</td> <td class='jst-n2'>20</td></tr>
		<tr><td class='jst-n1'>30</td> <td class='jst-n2'>40</td></tr>
	</table>

Using the toJson method would serialize it this:

	// jst.toJson();
	[
		{'n1':10, 'n2':20},
		{'n1':30, 'n2':40}
	]

You can also serialize just a single column:

	//result from jst.toJson('n1');
	[10, 30]

Use Inheritence for Custom Tables
---------------------------------

If the same table will be used in multiple places on the page, it can be useful to create a new Class for it, inheriting from jsTable, rather than doing the addColumn setup everytime.

Such a class would look something like this:

	var FileTable = new Class({
		Extends: jsTable,
		initialize: function(element, options) {

			this.addColumn('filename', 'File Name');
			this.addColumn('size');

		}
	});
