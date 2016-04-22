# d3-saveas

A simple plugin to add the ability to save a rendered snapshot of a d3 graph
locally, without any server interaction.

## Usage

This is an extension of d3.select, so it's as simple as:

	var svg = d3.select('body').append('svg')
		//configuration and graph drawing... later,
	svg.saveAs('filename.svg');

If you have a set of graphs, you can save a stack of them at once:

	graphs.saveAs('Graph-%2d.svg')

This will prompt the user to save each file, named `Graph-00.svg`,
`Graph-01.svg`, etc - obviously not ideal, but I've not yet integrated zip
capabilities (and I have a small architectural rethink there).  It's on The
List™.

If you want to add serializers, the interface is simple.  Add the extension to
d3.SaveAs.serializers as a function that accepts a DOM node and returns a
string.

	d3.SaveAs.serializers.pdf = function (node) {
		/*...*/
		return serialized;
	};
