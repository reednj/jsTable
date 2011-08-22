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

### Syntax:
### Arguments:
### Example:

jsTable Method: columnCount {#InlineEditor:columnCount}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: clear {#InlineEditor:clear}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: addColumns {#InlineEditor:addColumns}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: addColumn {#InlineEditor:addColumn}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: addRow {#InlineEditor:addRow}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: deleteRow {#InlineEditor:deleteRow}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: deleteRowById {#InlineEditor:deleteRowById}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: getCell {#InlineEditor:getCell}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: setCell {#InlineEditor:setCell}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: toData {#InlineEditor:toData}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:

jsTable Method: toJson {#InlineEditor:toJson}
-------------------------------------------------------------

### Syntax:
### Arguments:
### Example:
