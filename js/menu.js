/**
 * 菜单生成
 * @Author:杨婷
 * @DateTime  2016-07-16T15:58:01+0800
 * [type]
 * data-source--数据源
 * multiData -- 数据多级统计分析
 * cluster -- 聚类
 * category -- 分类
 * traffic -- 用户流量分群分析
 * hotspot -- 用户访问热点分析
 */
define(function(require, exports, module){
	var $ = require('jquery');
	var template = require('./template.js');
	var menu = {
		init: function(type){
			var me = this;
			var source = me.getHtml();
			var render = template.compile(source);
			var html = render({type: type});
			$('.menu-wrapper').empty().append(html);
			$('[data-toggle="tooltip"]').tooltip();
            $('.catalog-li').click(function(e){
                /*切换折叠指示图标*/
                if($(this).find('.absolute-down').hasClass('glyphicon-chevron-down')){
                    $(this).find('.absolute-down').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                }else{
                    $(this).find('.absolute-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                }
            });
		},
		getHtml: function(type){
			var html = '';
			$.ajax({
				type: 'get',
				url: '../layout/menu.tmpl',
				dataType: 'text',
				async: false,
				success: function(res){
					html = res;
				}
			});
			return html;
		}
	};
	module.exports = menu;
});
