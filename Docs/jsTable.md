Class: jsTable {#InlineEditor}
===================================
Javascript table control

jsTable Method: constructor {#InlineEditor:constructor}
-------------------------------------------------------------

### Syntax:
	var jst = new jsTable(element, options);

### Arguments:

1. element - (*mixed*) an element or element id
2. options - (*object*) jsTable options

### Options:

* empty_message (string)	-	This message is show when there are no rows in the table. Styled using the class 'jst-emptymessage'
* show_header_onempty (boolean)	-	should the table header be shown or hidden when the table is empty?

### Events:

* onRowAdded(row_index, row_data)	- called after each row is added.
* onRowDeleted(row_index, row_id)	- called after a row has been deleted
* onCellUpdated(row_id, column_id, cell_content) - called after a the contents of a cell have been changed by setCell

### Example:

var jst = new jsTable('some_div', {'onRowDeleted': function() {
		alert('row deleted');
	}
});


jsTable Method: rowCount {#InlineEditor:rowCount}
-------------------------------------------------------------
Returns a count of the number of rows currently in the table. Does not include the header.

### Example:
	var rc = jst.rowCount();

jsTable Method: columnCount {#InlineEditor:columnCount}
-------------------------------------------------------------
Returns a count of the number of columns in the table.

### Example:
	var cc = jst.columnCount();

jsTable Method: clear {#InlineEditor:clear}
-------------------------------------------------------------
Empties the table. Does not remove the header.

### Example:
	jst.clear();

jsTable Method: setEmptyMessage {#InlineEditor:setEmptyMessage}
-------------------------------------------------------------
Set the mesage
### Syntax:
	jst.setEmptyMessage(empty_message, show_header)

### Arguments:
 * empty_message (string) - This message is show when there are no rows in the table. Styled using the class 'jst-emptymessage'
 * show_header (boolean) - should the table header be shown or hidden when the table is empty?

### Example:
	jst.setEmptyMessage('table is empty', true);

jsTable Method: addColumn {#InlineEditor:addColumn}
-------------------------------------------------------------
Adds a column to the right of the table. If you call this when the table is not
empty the results can be unpredictable.

### Syntax:
	jst.addColumn(name, description)

### Arguments:
 * name (string) - the column name. Will be used later as an ID when referencing things by column
 * description (string) - column description to appear in the header

### Example:
	jst.addColumn('id', 'Employee ID');

jsTable Method: addColumns {#InlineEditor:addColumns}
-------------------------------------------------------------
Add multiple columns.

### Syntax:
	jst.addColumns(column_list);

### Arguments:
 * column_list (array) - an array of column objects in the format {name:, description:}

### Example:
	jst.addColumns([
		{name:'id', description:'Employee ID'},
		{name:'name', description: 'First Name'}
	]);


jsTable Method: addRow {#InlineEditor:addRow}
-------------------------------------------------------------
Add a row to the bottom of the table.

### Syntax:
	jst.addRow(col_1, col_2, ...)
### Arguments:
 * column_data (list) - a list of arguments containing the column contents. Can be a string, number or an element.

### Example:
	jst.addRow(
		'1234',
		'Nathan',
		new Element('a', {
			'href':'?id=1234',
			'text':'profile'
		})
	);

jsTable Method: deleteRow {#InlineEditor:deleteRow}
-------------------------------------------------------------
Removes a row from the index provided.

### Syntax:
	jst.deleteRow(row_index);

### Arguments:
 * row_index (number) - the index of the row to remove from the table.

### Example:
	jst.deleteRow(0); // delete the first row in the table

jsTable Method: deleteRowById {#InlineEditor:deleteRowById}
-------------------------------------------------------------
Removes a row from the table but by the internal row id, instead of the row index. This is
useful for linking to events, as the ids do not change when rows are added or removed.

### Syntax:
	jst.deleteRowById(row_id);

### Arguments:
 * row_id (number) - the row_id. This id is set at the time the row is added. It does not change when rows are added or removed.

### Example:
	jst.deleteRowById(23); // remove the row with id 23.

jsTable Method: getCell {#InlineEditor:getCell}
-------------------------------------------------------------
Returns the contents of the cell at the given row and column. The column_id can be an index, or the column name used when the column was added.

### Syntax:
	jst.getCell(row_index, column_id);

### Arguments:
 * row_index (number) - index of the row. Starting at zero from the first row (not the header)
 * column_id (mixed) - can be the column index, or the name of the column.

### Example:
	var employee_id = jst.getCell(12, 'id');

jsTable Method: setCell {#InlineEditor:setCell}
-------------------------------------------------------------
Set the content of the cell. You should always set the cell through this function, not directly
through the DOm.

### Syntax:
	jst.setCell(row_index, column_id, contents);

### Arguments:
 * row_index (number) - index of the row. Starting at zero from the first row (not the header)
 * column_id (mixed) - can be the column index, or the name of the column.
 * contents (mixed) - Can either be a string, a number or an element.

### Example:
	jst.setCell(12, 'name', 'New Name');

jsTable Method: toData {#InlineEditor:toData}
-------------------------------------------------------------
Serializes the table to a javascript data structure.

### Syntax:
	jst.toData(format);

### Arguments:
 * format (mixed) - can either be empty, a string or an array or column names. If an array of column names is passed then an array of objects containing the data from those columns is returned. If a string is passed in, then a flat array of the contents of that column is returned. If no argument is passed then the entire table is serialized.

### Example:
	// returns an array like [12, 25, 36, 47, 58];
	jst.toData('id');

	// returns something like [
		{'id':12, 'firstname':'Nathan'},
		{'id':25, 'firstname':'David'},
		{'id':36, 'firstname':'John'},
		{'id':47, 'firstname':'Bethany'},
		{'id':58, 'firstname':'Samantha'},
	]
	//
	jst.toData('id', 'firstname);

jsTable Method: toJson {#InlineEditor:toJson}
-------------------------------------------------------------
Serializes the data the same as the toData method, but encodes it into json using
JSON.encode.

