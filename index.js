(function (d3) {
	d3.selection.prototype.saveAs = function (filePattern, callback) {
		function saveOneAs(node, filename, callback) {
			var type = filename.replace(/^.*\.([^\.]+)$/, '$1').toLowerCase();
			var serialize = d3.SaveAs.serializers[type] || d3.SaveAs.serializers[d3.SaveAs.serializers['*']];
			var content = serialize(node);
			if (this.window) {
				var blob = new Blob([content], {type: type | "octet/stream"}),
					a = document.createElement("a"),
					url = window.URL.createObjectURL(blob);
				a.style.display = "none";
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
				callback && callback(null, true);
			} else {
				require('fs').writeFile(filename, content, callback);
			}
		}
		if (this.empty()) { return; }
		var count = this.size();
		if (count === 1) {
			saveOneAs(this.node(), filePattern, callback);
		} else {
			function collect(error, result) {
				if (error) { throw error; }
				count -= 1;
				if (count === 0) {
					callback && callback(null, true);
				}
			}
			this.each(function (data, index) {
				saveOneAs(this, filePattern.replace(/%(\d+)d/g, function (match, pad) {
					if (!pad) { return index; }
					pad = new Array(pad + 1).join('0');
					return pad + index.toString();
				}), collect);
			});
		}
	};
	if (!this.XMLSerializer) {
		XMLSerializer = function () {
			return require('xmlserializer');
		};
	}
	var xmlSerializer;
	d3.SaveAs = {
		serializers: {
			"svg": function (node) {
				if (!xmlSerializer) {
					xmlSerializer = new XMLSerializer();
				}
				return xmlSerializer.serializeToString(node);
			},
			'*': 'svg'
		}
	};
}.call(this, this.d3 || (!this.window && require('d3'))));
