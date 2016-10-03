define(function(require, exports, module){
	var $ = require('jquery');
	var bt = require('./template.js');

	function list(id){
		$el = $('#'+id);
		this.init($el);
	}
	list.prototype.init = function($el){
		$.ajax({
			type: 'get',
			url: '../json/listAllSources.json',
			dataType: 'json',
			success: function(res){
				var source = '<option value="-1">请选择</option>'
							+'{{each sources as value i}}'
							+'<option value="{{value.id}}">{{value.name}}</option>'
							+'{{/each}}';
				var render = bt.compile(source);
				var html = render(res);
				$el.empty().append(html);
			}
		});
	};
	module.exports = list;
});