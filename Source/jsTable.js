/*
---
description: jsTable - Simple javascript table control

license: MIT-style

authors:
- Nathan Reed

requires:
- core/1.2.4: [Class, Event, Element, Selectors, JSON, Request]

provides:
- jsTable
- $e

...
*/

var jsTable = new Class({
	initialize: function(elem, options) {
		this.element = $(elem);
		this.options = options || {};

		this.options.onRowDeleted = this.options.onRowDeleted || $empty;
		this.options.onRowAdded = this.options.onRowAdded || $empty;
		this.options.onCellUpdated = this.options.onCellUpdated || $empty;
		this.options.empty_message = this.options.empty_message || null;
		this.options.show_header_onempty = this.options.show_header_onempty || false;

		this.table = null;
		this.thead = null;
		this.tbody = null;
		this.empty_tr = null;

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

		this.table = $e('table', {
			'class': 'jst-table',
			'children':[
				this.thead = $e('thead', {'children': [$e('tr')]}),
				this.tbody = $e('tbody')
			]
		}).inject(this.element);

		// if the empty message has been set, then create that element as well
		if(this.options.empty_message != null) {
			this._createEmptyMessage();
		}

	},

	_createEmptyMessage: function() {
		this.empty_tr = $e('div', {'class':'jst-emptymessage', 'text': this.options.empty_message});
		this.element.grab(this.empty_tr);

		// show we be showing the message or not?
		this._setEmptyMessageVisibility();
	},

	_setEmptyMessageVisibility: function() {
		if(this.empty_tr == null) {
			return;
		}

		if(this.data.length > 0 && this.empty_tr.getStyle('display') != 'none') {
			this.empty_tr.hide();

			if(this.options.show_header_onempty !== true) {
				this.thead.show();
			}

		} else if(this.data.length == 0 && this.empty_tr.getStyle('display') != '') {
			this.empty_tr.show();

			if(this.options.show_header_onempty !== true) {
				this.thead.hide();
			}
		}
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

		this._setEmptyMessageVisibility();

		return this;
	},

	setEmptyMessage: function(empty_message, show_header) {
		this.options.empty_message = empty_message;

		if($defined(show_header)) {
			this.options.show_header_onempty = show_header;
		}

		// if the empty message is not in the page yet, then create the
		// element and add it to the page.
		if(!$defined(this.empty_tr)) {
			this._createEmptyMessage();
		}

		return this;
	},

	addColumns: function(columns) {
		columns.each(function(col) {
			this.addColumn(col.name, col.description);
		}.bind(this));

		return this;
	},

	addColumn: function(name, desc) {
		name = name || 'none';
		desc = desc || name;

		this.column_list.push({'name': name, 'description': desc});

		// now create the header element
		$e('th', {'text': desc, 'class':'jst-'+name}).inject(this.thead.getElement('tr'));

		return this;
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
			var new_td = $e('td', {
				'id': element_id,
				'class':'jst-' + column_name
			});

			// insert elements into the table directly.
			// everything else gets converted to a string and
			// goes in as innerHTML
			if($type(cell_content) == 'element') {
				new_td.grab(cell_content);
			} else {
				new_td.innerHTML = cell_content;
			}

			new_row.grab(new_td);

			// add to the internal data
			row_data.push(cell_content);
		}

		this.tbody.grab(new_row);
		this.row_list.push(this.data.length);
		this.data.push(row_data);

		this.options.onRowAdded(this.data.length-1, row_data);

		this._setEmptyMessageVisibility();

		return this;
	},

	deleteRow: function(row_index) {
		if(row_index < 0 || row_index > this.data.length - 1) {
			return;
		}

		var row_data = this.data[row_index];
		var row_id = this.row_list[row_index];
		var tr_id = this._getRowElementId(row_id);

		this.row_list.erase(row_id);
		this.data.erase(row_data);
		$(tr_id).dispose();

		this.options.onRowDeleted(row_index, row_id);

		this._setEmptyMessageVisibility();

		return this;
	},

	deleteRowById: function(row_id) {
		this.deleteRow(this.row_list.indexOf(row_id));
		return this;
	},

	// aliases for deleteRow. I find remove move natural than delete for some reason.
	removeRow: function(row_index) {
		return this.deleteRow(row_index);
	},

	removeRowById: function(row_id) {
		return this.deleteRowById(row_id);
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

		var td = $(this._getCellElementId(row_id, column_id));

		if($type(cell_content) == 'element') {
			td.empty();
			td.inject(cell_content);
		} else {
			td.innerHTML = cell_content;
		}

		this.data[row_id][column_id] = cell_content;

		this.options.onCellUpdated(row_id, column_id, cell_content);

		return this;
	},

	toData: function(format) {
		if(!$defined(format)) {
			// dump every column of the table to an object.
			return this.toData(this.column_list.map(function(o) { return o.name; }));
		} else if($type(format) == 'string') {

			// assume the string is a column name, return just that column
			var column_id = this._getColumnIndex(format);
			return this.data.map(function(row) {
				if($type(row[column_id]) != 'element') {
					return row[column_id];
				} else {
					return null;
				}
			});

		} else if($type(format) == 'array') {
			return this.data.map(function(row) {
				var new_row = {};

				for(var i=0; i < row.length; i++) {
					if($type(row[i]) != 'element') {
						new_row[this.column_list[i].name] = row[i];
					}
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

// this is now implemented in mootool.more (finally!)
Element.implement({
   show: function() {this.setStyle('display','');},
   hide: function() {this.setStyle('display','none');}
});
