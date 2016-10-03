define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('../../../util/template.js');
    require('../../dialog/dialog.js');
    require('../../../util/jquery.form.js');
    var menu = require('../../menu/menu.js');
    var popup = require('../../../popup.js');

    menu.init('file-batch');

    module.exports = {
        init: function(opt){
            var me = this;
            me.domain = {};
            me.type = {};
            me.rn = 10;
            me.opt = opt;

            me.bindEvent();
        }, 
        bindEvent: function(){
            var me = this;
            // 文件上传
            $('#file-upload').click(function(){
                $('#upload-file-input').click();
            });
            $('#upload-file-input').wrap('<form id="myupload" action="'+me.opt.uploadFile.url+'" method="'+ me.opt.uploadFile.type +'" enctype="multipart/form-data"></form>');
            $('#upload-file-input').on('change',function(){ //选择文件
                $("#myupload").ajaxSubmit({
                    dataType:  'json', //数据格式为json
                    success: function(res) { //成功
                        if(res.errno == 0){
                            me.renderTable({
                                el: 'domain',
                                data: res.data.domain,
                                type: 'domain'
                            });
                            me.renderTable({
                                el: 'type',
                                data: res.data.type,
                                type: 'type'
                            });
                        }else{
                            popup('上传文件失败');
                        }
                    },
                    error:function(xhr){ //上传失败
                        console.log("error");
                        console.log(xhr.responseText); //返回失败信息
                    }
                });
            });
            
            $('.tab-wp').on('click', '.pager-jump-btn', function(){
                var $el = $(this);
                var $tabPane = $el.parents('.tab-pane');
                var type = $tabPane.attr('id');
                var $pagerInput = $el.parents('.pager-jump-wp').find('.pager-jump-input');
                var num = parseInt($.trim($pagerInput.val()));

                var param = {
                    pn: (num - 1) * me.rn,
                    rn: me.rn
                }
                if(type == 'domain'){
                    $.ajax({
                        url: me.opt.pageDomain.url,
                        type: me.opt.pageDomain.type,
                        data: param
                    }).done(function(res){
                        if(res.errno == 0){
                            me.renderTable({
                                el: 'domain',
                                data: res.data,
                                type: 'domain',
                                num: num
                            });
                        }else{
                            popup('失败');
                        }
                    });
                }else if(type == 'type'){
                    $.ajax({
                        url: me.opt.pageType.url,
                        type: me.opt.pageType.type,
                        data: param
                    }).done(function(res){
                        if(res.errno == 0){
                            me.renderTable({
                                el: 'type',
                                data: res.data,
                                type: 'type',
                                num: num
                            });
                        }else{
                            popup('失败');
                        }
                    });
                }
            });
        },
        jump: function(num){

        },
        renderTable: function(opt){
            var me = this;
            var $el = $('#' + opt.el);
            me.tmpl = me.tmpl || bt.compile($('#result-table-tmpl').html());

            var data = {};
            data.type = opt.type;
            data.list = opt.data.list;
            data.total = opt.data.total;
            data.url = opt.data.url;

            data.pagerNum =  (opt.num) ? opt.num : 1;
            data.pagerTotal = Math.ceil(data.total / me.rn);

            $el.html(me.tmpl(data));

        }
    };
});