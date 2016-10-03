/**
 * 菜单生成
 * @Author:杨婷
 * @DateTime  2016-10-02
 * [type]
 * index--首页
 * interface -- 接口演示
 * file-batch -- 文件批处理
 * domain-manage -- 域名管理
 * type-manage -- 类型管理
 * developer -- 开发者
 */
define(function(require, exports, module){
    var $ = require('../../util/jquery.min.js');
    var template = require('../../util/template.js');
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
                url: '../js/widget/menu/menu.tmpl',
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
