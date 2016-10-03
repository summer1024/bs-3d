define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('./template.js');
    require('./dialog.js');
    require('./jquery.form.js');
    var menu = require('./menu.js');
    var popup = require('./popup.js');
    //生成菜单 
    menu.init('data-source');

    var source = {
        init: function(opt){
            var me = this;
            me.initTable(opt.listAllSources);
            //上传文件
            me.bindUpload(opt);
            //操作按钮
            me.bindEvent(opt);
            
        },
        initTable: function(item){
            var me = this;
            $.ajax({
                url: item.url,
                type: item.type,
                dataType: 'json',
                success: function(res){
                    if(res.status == 0){
                        me.processData(res);
                    }else{
                        alert(res.messages);
                    }
                }
            });
        },
        bindUpload: function(opt){
            $('#upload-file-btn').click(function(){
                $('#upload-file-input').click();
            });
            $('#upload-file-input').wrap('<form id="myupload" action="'+opt.uploadSource.url+'" method="post" enctype="multipart/form-data"></form>');
        	$('#upload-file-input').on('change',function(){ //选择文件
        	    $("#myupload").ajaxSubmit({
        	        dataType:  'json', //数据格式为json
        	        success: function(res) { //成功
                        var date = new Date();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var year = date.getYear() + 1900;
                        res.date = year + '-' + month + '-' + day;
                        $('.table').find('tbody').append(bt('data-source-tr', res));
        	        },
        	        error:function(xhr){ //上传失败
        	        	console.log("error");
        	            console.log(xhr.responseText); //返回失败信息
        	        }
        	    });
        	  });
        },
        bindEvent: function(opt){
            $('.table').on('click', '.opt', function(){
                var $el = $(this);
                var data = {id: $el.parents('tr').data('id')};
                //处理逻辑
                if($el.hasClass('process') && !$el.hasClass('loading')){
                    $el.text("正在请求");
                    $el.addClass("loading");
                    $.ajax({
                        url: opt.cleanSource.url,
                        type: opt.cleanSource.type,
                        data: data,
                        dataType: 'json',
                        success: function(res){
                            if(res.status == 0){
                                $el.parents('tr').find('td').eq(3).html("处理中");
                                $el.text('处理中');
                                popup('提交成功，后台处理中～');
                            }else{
                                alert(res.messages);
                            }
                        }
                    });
                //删除逻辑
                }else if($el.hasClass('del') && !$el.hasClass('loading')){
                    $el.text("正在请求");
                    $el.addClass("loading");
                    $.ajax({
                        url: opt.delSource.url,
                        type: opt.delSource.type,
                        data: data,
                        dataType: 'json',
                        success: function(res){
                            if(res.status == 0){
                                $el.parents('tr').remove();
                            }else{
                                alert(res.messages);
                            }
                        }
                    });
                //查看逻辑
                }else if($el.hasClass('view') && !$el.hasClass('loading')){
                    $el.text("正在请求");
                    $el.addClass("loading");
                    $.ajax({
                        url: opt.showDatas.url,
                        type: opt.showDatas.type,
                        data: data,
                        dataType: 'json',
                        success: function(res){
                            if(res.status == 0){

                                $.MsgBox.Alert({
                                    title: '查看数据源',
                                    content: bt('view-source-table',res),
                                    width: 900
                                });

                                $el.text('查看');
                                $el.removeClass('loading');
                            }else{
                                alert(res.messages);
                            }
                        }
                    });
                }
            });


        },
        processData: function(data){
            $('.table').find('tbody').append(bt('data-source-table', data));
        }
    };
    module.exports = source;
});
