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
		this.column_list = [];

		this._createTable();
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
		var new_row = $e('tr');

		for(var i=0; i < arguments.length; i++) {
			var cell_content = arguments[i];
			$e('td', {
				'text': cell_content, 
				'class':'jst-'+name
			}).inject(new_row);
		}

		this.tbody.grab(new_row);
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
