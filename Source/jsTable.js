/*
 * jsTable
 *
 * Nathan Reed, 2011-08-13
 */

var jsTable = new Class({
	initialize: function(elem, options) {
		this.element = $(elem);
		this.options = options || {};

		this.thead = null;
		this.tbody = null;

		this.table_id = (Math.random() * 1000).round();

		this.data = [];
		this.column_list = [];
		this.row_list = []; // maps row_indexes to row_ids

		this._createTable();
	},

	
	_getCellElementId: function(row_id, column_name) {
		if($type(column_name) != 'string') {
			column_name = this.column_list[column_name].name;
		}

		return 'jst-' + this.table_id + '-' + column_name + '-' + row_id;
	},

	_getRowElementId: function(row_id) {
		return 'jst-' + this.table_id + '-' + row_id;
	},

	_getColumnIndex: function(column_name){

		for(var i=0; i < this.column_list.length; i++) {
			if(this.column_list[i].name == column_name) {
				return i;
			}
		}

		return null;
	},

	// inititialze the table element inside this.element
	_createTable: function() {
		this.element.empty();

		$e('table', {
			'class': 'js-table',
			'children':[
				this.thead = $e('thead', {'children': [$e('tr')]}),
				this.tbody = $e('tbody')
			]
		}).inject(this.element);

	},

	// does not include the head row.
	rowCount: function() {
		return this.data.length;
	},

	columnCount: function() {
		return this.column_list.length;
	},

	// deletes all content, but not the header
	clear: function() {
		this.data = [];
		this.tbody.empty();
	},

	addColumns: function(columns) {
		columns.each(function(col) {
			this.addColumn(col.name, col.description);
		}.bind(this));
	},

	addColumn: function(name, desc) {
		name = name || 'none';
		desc = desc || name;
		
		this.column_list.push({'name': name, 'description': desc});
		
		// now create the header element
		$e('th', {'text': desc, 'class':'jst-'+name}).inject(this.thead.getElement('tr'));
	},

	addRow: function() {
		var tr_id = this._getRowElementId(this.data.length);
		var new_row = $e('tr', {'id': tr_id});
		var row_data = [];

		for(var i=0; i < arguments.length; i++) {
			var cell_content = arguments[i];
			var column_name = this.column_list[i].name;
			var element_id = this._getCellElementId(this.data.length, column_name);

			// create the cell element
			$e('td', {
				'id': element_id,
				'text': cell_content, 
				'class':'jst-' + column_name
			}).inject(new_row);

			// add to the internal data
			row_data.push(cell_content);
		}

		this.tbody.grab(new_row);
		this.row_list.push(this.data.length);
		this.data.push(row_data);

	},

	deleteRow: function(row_index) {
		var row_data = this.data[row_index];
		var row_id = this.row_list[row_index];
		var tr_id = this._getRowElementId(row_id);

		this.row_list.erase(row_id);
		this.data.erase(row_data);
		$(tr_id).dispose();

	},

	deleteRowById: function(row_id) {
		this.deleteRow(this.row_list.indexOf(row_id));
	},

	getCell: function(row_id, column_id) {
		if($type(column_id) == 'string') {
			// if the column_id has been passed in as a string, assume it is a column_name
			// so convert to to the column_id
			column_id = this._getColumnIndex(column_id);
		}

		return this.data[row_id][column_id];
	},

	setCell: function(row_id, column_id, cell_content) {
		if($type(column_id) == 'string') {
			column_id = this._getColumnIndex(column_id);
		}

		this.data[row_id][column_id] = cell_content;
		$(this._getCellElementId(row_id, column_id)).innerHTML = cell_content;
	},

	toData: function(format) {
		if(!$defined(format)) {
			// dump every column of the table to an object.
			return this.toData(this.column_list.map(function(o) { return o.name; }));
		} else if($type(format) == 'string') {
			// assume the string is a column name, return just that column
			var column_id = this._getColumnIndex(format);
			return this.data.map(function(row) { return row[column_id]; });
		} else if($type(format) == 'array') {
			return this.data.map(function(row) {
				var new_row = {};

				for(var i=0; i < row.length; i++) {
					new_row[this.column_list[i].name] = row[i];
				}

				return new_row;
			}.bind(this));
		}
	},

	toJson: function(format) {
		return JSON.encode(this.toData(format));
	}

});

//
// $e(): Use the mootools new element function to chain up element creation in a nice way
//
// eg. $e('b', 'bold text'); -> <b>bold text</b>
//     $e('a', {'href': 'http://www.google.com', 'text': 'google'}); -> <a href='http://www.google.com'>google</a>
//
// A more complex example using children:
//
//    $e('a', {
//       'href': './home',
//       'children': [
//          $e('img', {'src': './logo.png', 'title': 'popacular'}),
//          $e('span', 'popacular.com/home')
//       ]
//    });
//
// gives:
// <a href='./home'>
//    <img src='./logo.png' title='popacular' />
//    <span>popacular.com/home<span>
//  </a>
//
// Created:  2010-05-21
// License: MIT-Style License
// Nathan Reed (c) 2010
//
function $e(tag, props) {
   tag = tag || 'div';

   if(!$defined(props)) {
      return new Element(tag);
   }

   // normalize the properties element for the
   // mootools element constructor
   if($type(props) == 'string') {
      props = {'text': props};
   } else if($type(props) == 'element') {
      props = {'children': props};
   }

   // remove the children property from the array, we don't want it in there.
   // because when we pass these properties to the mootools element function it
   // might get confused.
   var children = props.children;
   props.children = null;

   var new_element = new Element(tag, props);

   if($defined(children)) {

      if($type(children) == 'element') {
         // if they have just passed through one child, then
         // normalize it by turning it into an array with one element.
         children = [children];
      }

      // add the children to the new element one by one
      children.each(function(item) {
         new_element.grab(item);
      });

   }

   return new_element
}
