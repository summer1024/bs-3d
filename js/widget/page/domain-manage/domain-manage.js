define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('../../..//util/template.js');
    require('../../dialog/dialog.js');
    var menu = require('../../menu/menu.js');
    var popup = require('../../../popup.js');

    menu.init('domain-manage');

    module.exports = {
        init: function(opt){
            var me = this;
            
            me.rn = 10;
            me.param = {};
            me.opt = opt;
            me.bindEvents(opt);
            // 初始化加载所有表格，需要与后端对一下
            $('.search-domain-btn').click();
        },
        jump: function(num){
            var me = this;
            me.param.pn = (num - 1) * me.rn;

            $.ajax({
                url: me.opt.searchDomain.url,
                type: me.opt.searchDomain.type,
                data: me.param
            }).done(function(res){

                if(res.errno == 0){
                    var data = {};
                    data.total = res.data.total;
                    data.list = res.data.list;
                    data.pagerTotal = Math.ceil(data.total / me.rn);
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
                        var param = {
                            domain: $.trim($('#pop-domain').val()),
                            name: $.trim($('#pop-name').val()),
                            type: $.trim($('#pop-type').val())
                        };
                        $.ajax({
                            url: opt.addDomain.url,
                            type: opt.addDomain.type,
                            data: param
                        }).done(function(res){
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
                var param = {
                    domain: domain,
                    name: name,
                    type: type,
                    num: num,
                    isShowNo: isShowNo
                }
                me.param = param;
                me.param.pn = 0;
                me.param.rn = me.rn;
                $.ajax({
                    url: opt.searchDomain.url,
                    type: opt.searchDomain.type,
                    data: param
                }).done(function(res){

                    if(res.errno == 0){
                        var data = {};
                        data.total = res.data.total;
                        data.list = res.data.list;
                        data.pagerTotal = Math.ceil(data.total / me.rn);
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
                            var param = {
                                id: id,
                                domain: $.trim($('#pop-domain').val()),
                                name: $.trim($('#pop-name').val()),
                                type: $.trim($('#pop-type').val())
                            };
                            $.ajax({
                                url: opt.mdfDomain.url,
                                type: opt.mdfDomain.type,
                                data: param
                            }).done(function(res){
                                if(res.errno == 0){
                                    $tr.find('td').eq(1).html(param.domain);
                                    $tr.find('td').eq(2).html(param.name);
                                    $tr.find('td').eq(3).html(param.type);
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
                        url: opt.delDomain.url,
                        type: opt.delDomain.type,
                        data: param
                    }).done(function(res){
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