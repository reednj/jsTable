jsTable
============
jsTable is a mootools control designed to make it easy to add data tables to the page with javascript. It is designed to be very easy to
serialize in order to send the data to the server.

![ScreenShot](http://)

Usage
------

(This is only a summary. Please see the documentation for a method by method description of usage)

If we have a div object in the html that looks like this:

<div id='new-table'></div>

It can be turned into a jsTable by constructing the object and passing the element as a parameter.

	var jst = new jsTable('new-table');

Then we add some columns to the table:

	jst.addColumn('filename', 'File Name');
	jst.addColumn('size'); // if the description is not given, the column name is used instead

Now data can be added to the table. Elements can be added, as well simple strings and html.

	jst.addRow('test.txt', '12kb');

You can get and set the contents of the cells using the setCell, getCell functions

	var contents = jst.getCell(row_index, column_name);
	jst.setCell(row_index, column_name, contents);

You can serialize the table to a javascript object, or to a json string using the methods toJson and toData respectively.

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
