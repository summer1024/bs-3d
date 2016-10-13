define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('../../../util/template.js');
    var urlrouter = require('../../url/url.js');
    require('../../dialog/dialog.js');
    var menu = require('../../menu/menu.js');
    var popup = require('../../../popup.js');

    menu.init('domain-manage');

    module.exports = {
        init: function(opt){
            var me = this;
            
            me.pageSize = 10;
            me.param = {};
            me.opt = urlrouter;
            me.bindEvents(urlrouter);
            // 初始化加载所有表格，需要与后端对一下
            $('.search-domain-btn').click();
        },
        jump: function(num){
            var me = this;
            me.param.page = num;

            $.ajax({
                url: me.opt.searchDomain.url,
                type: me.opt.searchDomain.type,
                data: me.param
            }).done(function(res){
                res = JSON.parse(res);
                if(res.errno == 0){
                    var data = {};
                    data.total = res.data.total;
                    data.list = res.data.list;
                    data.pagerTotal = Math.ceil(data.total / me.pageSize);
                    data.pagerNum = me.param.page;


                    $('.result-wp').html(bt("domain-result-table", data));
                }else{
                    $.MsgBox.Alert({
                        content: res.errmsg,
                        title: "系统提示",
                        width: 400
                    });
                }
                
            });

        },
        bindEvents: function(opt){
            var me = this;
            /*
             * 添加域名
             * tmpl: pop-dialog
             * ajaxURL: opt.addDomain.url / type
             */
            $('.add-domain-btn').on('click', function(){
                var data = {};
                data.type = "add";
                $.MsgBox.Confirm({
                    content: bt('pop-dialog', data),
                    width: 500,
                    title: '添加域名',
                    callback: function(){
                        
                        var domain = $.trim($('#pop-domain').val());
                        var name = $.trim($('#pop-name').val());
                        var type = $.trim($('#pop-type').val());
                        
                        var param = {};
                        param.domain = encodeURIComponent(domain);
                        param.name = encodeURIComponent(name);
                        param.type = encodeURIComponent(type);

                        $.ajax({
                            url: urlrouter.addDomain.url,
                            type: urlrouter.addDomain.type,
                            data: param
                        }).done(function(res){
                            res = JSON.parse(res);
                            if(res.errno == 0){
                                popup('添加成功！');
                            }else{
                                popup(res.errmsg);
                            }
                        });
                    }
                });
            });
            /*
             * 搜索域名
             * tmpl: domain-result-table
             * ajaxUrl: opt.searchDomain.url / type
             */
            $('.search-domain-btn').on('click', function(){
                var domain = $.trim($('#domain').val());
                var name = $.trim($('#domain-name').val());
                var type = $.trim($('#domain-type').val());
                var num = $.trim($('#domain-num').val());
                var isShowNo = $('#domain-checkbox').get(0).checked;

                // 传入的参数
                var param = {};
                if(domain != ''){
                    param.domain = encodeURIComponent(domain);
                }
                if(name != ''){
                    param.name = encodeURIComponent(name);
                }
                if(type != ''){
                    param.type = encodeURIComponent(type);
                }
                if(num != ''){
                    param.num = num;
                }
                param.isShowNo = isShowNo;
                me.param = param;
                me.param.page = 1;
                me.param.pageSize = me.pageSize;
                $.ajax({
                    url: urlrouter.searchDomain.url,
                    type: urlrouter.searchDomain.type,
                    data: param
                }).done(function(res){
                    res = JSON.parse(res);
                    if(res.errno == 0){
                        var data = {};
                        data.total = res.data.total;
                        data.list = res.data.list;
                        data.pagerTotal = Math.ceil(data.total / me.pageSize);
                        data.pagerNum = 1;


                        $('.result-wp').html(bt("domain-result-table", data));
                    }else{
                        $.MsgBox.Alert({
                            content: res.errmsg,
                            title: "系统提示",
                            width: 400
                        });
                    }
                    
                });
            });
            
            $('.result-wp').on('click', '.pager-jump-btn', function(){
                var num = parseInt($('.pager-jump-input').val());
                me.jump(num);
            });
             
            $('.result-wp').on('click', '.opt', function(){
                var $el = $(this);
                var $tr = $el.parents('tr');
                var id = $tr.data('id');

                if($el.hasClass('mdf')){
                    /*
                     * 修改域名
                     * tmpl: pop-dialog
                     * ajaxURL: opt.mdfDomain.url / type
                     */
                    var data = {};
                    data.type = 'mdf';
                    data.data = {
                        domain: $.trim($tr.find('td').eq(1).html()),
                        name: $.trim($tr.find('td').eq(2).html()),
                        type: $.trim($tr.find('td').eq(3).html())
                    }
                    $.MsgBox.Confirm({
                        content: bt('pop-dialog', data),
                        width: 400,
                        title: '修改域名',
                        callback: function(){
                            var domain = $.trim($('#pop-domain').val());
                            var name = $.trim($('#pop-name').val());
                            var type = $.trim($('#pop-type').val());
                            var param = {
                                id: id,
                                domain: encodeURIComponent(domain),
                                name: encodeURIComponent(name),
                                type: encodeURIComponent(type)
                            };
                            $.ajax({
                                url: urlrouter.mdfDomain.url,
                                type: urlrouter.mdfDomain.type,
                                data: param
                            }).done(function(res){
                                res = JSON.parse(res);
                                if(res.errno == 0){
                                    $tr.find('td').eq(1).html(domain);
                                    $tr.find('td').eq(2).html(name);
                                    $tr.find('td').eq(3).html(type);
                                    popup('修改成功！');
                                }else{
                                    popup('修改失败！');
                                }
                            });
                        }
                    });

                }else if($el.hasClass('del')){
                    /*
                     * 删除域名
                     * ajaxURL: opt.delDomain.url / type
                     */
                    var param = {
                        id: id
                    };

                    $.ajax({
                        url: urlrouter.delDomain.url,
                        type: urlrouter.delDomain.type,
                        data: param
                    }).done(function(res){
                        res = JSON.parse(res);
                        if(res.errno == 0){
                            $tr.remove();
                            popup('删除成功！');
                        }else{
                            popup('删除失败！');
                        }
                    });
                }
            });
        }
    }
});