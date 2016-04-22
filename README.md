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


TODO:

* .svgz support - Should be simple enough.  Requires the the consumer of
serializers to support Blob return values.
* Raster image support - Translate SVG to canvas, get blob, save blob.
* .zip support - Requires an extension point for batches, and elimination of
single-file save.  I'll want this for .pdf as well: you'd want to make a page
for each svg tag.
* .pdf support - this is a higher mountain to climb than you'd think.
	* I've seen the following, but they're just wrong.  Essentially, the output
	is PNGs wrapped in a PDF - even for text and shapes.  Since we're starting
	from .svg files, it would make a lot more sense to build a pdf from those
	_correctly_, using the SVG's computed styles.  This may or may not mean pdf
	output would be unsupported using jsdom under node (in a node environment,
	we could declare Inkscape as a dependency, and use that).
		* https://github.com/CBiX/svgToPdf.js
		* https://github.com/MrRio/jsPDF
	* I may not go this route directly, opting to use the browser's `print` function
	instead.

