/**
 * id：使用算法的id
 * paras：传入参数列表 
 *     -para：参数名
 *     -value：值
 * trainData：训练数据id
 * columns：选择的列号（列表）
 * testData：测试数据id（聚类算法该字段可不传）
 */                     
define(function(require, exports, module){
	var $ = require('jquery');
	require('bootstrap');
    var bt = require('./template.js');
    var menu = require('./menu.js');
    var list = require('./list');
    var type = getQueryString('type');
    //生成菜单 
    menu.init(type);
    
    var cluster = {
        init: function(options){
        	var me = this;
        	me.options = options;
            me.type = type;
            me.data = {};
            me.data.columns = [];
            me.generateHTML(options);
            
            me.isbind = false;

        },
        generateHTML: function(){
            var me = this;
            var data = {
                type: me.type
            };
            $('#page-menu-wp').empty().append(bt('page-menu', data));
            $('#tabsInMining').empty().append(bt('page-content', data));

            me.bindEvent();
        },
        bindEvent: function(opt){
            var me = this;
            var data = {
                type: me.type
            };
            new list('data-source-list');
            new list('data-source-list2');
            $('#viewHistory').on('click', function(){
                $.ajax({
                    url: me.options.listDMJob.url,
                    type: me.options.listDMJob.type,
                    dataType: 'json',
                    data: data,
                    success: function(res){
                        if(res.status != 0){
                            alert(res.message);
                        }else{
                            $('#history-list-table').find('tbody').empty().append(bt('history-list-tmpl', res));
                        }
                    }
                });
                $('.mining-content').hide(100);
                setTimeout(function(){
                    $('.history-content').removeClass('hide').show();
                },150);
            });
            //show历史记录中查看
            $('.history-list-wp').on('click', '.opt', function(){
                if($(this).hasClass('view')){
                    
                    var data = {
                        id: $(this).parents('tr').data('id')
                    };
                    $.ajax({
                        url: me.options.getDMJobRes.url,
                        type: me.options.getDMJobRes.type,
                        dataType: 'json',
                        data: data,
                        success: function(res){
                            if(res.status == 0){
                                //process data -- 图形化
                                $('.history-list-wp').removeClass('hide').addClass('hide');
                                $('.history-detail-wp').removeClass('hide');
                            }else{
                                alert(res.message);
                            }
                        }
                    });
                    
                }
            });
            //查看detail中返回
            $('.history-detail-wp').on('click', '.return', function(){
                $('.history-list-wp').removeClass('hide');
                $('.history-detail-wp').removeClass('hide').addClass('hide');
            });
            $('.btn-d-blue').on('click', function(){
                var target = $(this).data('source');
                var $nextEl = $('#' + target);
                var type = $(this).data('type');
                var nextapi = $(this).data('nextapi');

                if($(this).data('val') === 0){
                    showNext();
                }else if($(this).data('val') === 1){
                    // 验证阶段
            		// 数据源选择验证 --- 验证是否为空
            		if(type === 'list1'){
            			if($('#data-source-list').val() != -1){
                            me.data.trainData = $('#data-source-list').val();
            				showNext();
            			}else{
            				alert('请选择数据源');
            			}
            		}
                    else if(type === 'list2'){
                        if($('#data-source-list2').val() != -1){
                            me.data.testData = $('#data-source-list2').val();
                            showNext();
                        }else{
                            alert('请选择数据源');
                        }
                    }
            		// 聚类属性选择验证
            		else if(type === 'show'){
                        if($("input[name='prop-check']:checked").length == 0){
                            alert('请选择至少一个聚类属性');
                        }else{
                            $("input[name='prop-check']:checked").each(function(){
                                me.data.columns.push($(this).data('id'));
                            });
                            showNext();
                        }
            		}
            		// 算法选择设置验证 --- 第三步验证
            		else if(type === 'get'){
                        if($('#alg-select').val() == -1){
                            alert('请选择算法');
                        }else{
                            var isTextEmpty = false;
                            $('.alg-value').each(function(){
                                if($(this).val() == ''){
                                    isTextEmpty = true;
                                    return false;
                                }
                            });
                            if(isTextEmpty){
                                alert('请将相关信息填写完整！');
                            }else{
                                me.data.paras = [];
                                $('.alg-single-div').each(function(){
                                    var para = $(this).find('.alg-para').data('name');
                                    var value = $(this).find('.alg-value').val();
                                    me.data.paras.push({
                                        para: para,
                                        value: value
                                    });
                                    me.data.id = $('#alg-select').val();
                                });
                                showNext();
                            }
                        }
                        
            		}

                    //生成下一tab阶段
                    if(nextapi === 'showDatas'){
                        generateTab(nextapi, {id: me.data.trainData}, function(res){
                            if(res.status == 0){
                                $('#cluster-prop-table').find('tbody').empty().append(bt('cluster-prop-tr', res));
                            }else{
                                alert(res.message);
                            }
                        });
                    }else if(nextapi === 'getDMAlg'){
                        generateTab(nextapi, {type: me.type}, function(res){
                            if(res.status == 0){
                                var _obj = {};
                                for(var pos = 0; pos < res.Algs.length; pos++){
                                    _obj[res.Algs[pos].id] = res.Algs[pos].paras;
                                }
                                $('#alg-select').empty().append(bt('alg-select-tmpl', res));
                                if(me.isbind == false){
                                    me.isbind = true;
                                    $('#alg-select').on('change', function(){
                                        var thisId = $('#alg-select').val();
                                        $('#alg-div').empty().append(bt('alg-div-tmpl', {data: _obj[thisId]}));
                                    });
                                }
                            }else{
                                alert(res.message);
                            }
                        });
                    }else if(nextapi === 'submitDMJob'){
                        generateTab(nextapi, me.data, function(res){
                            if(res.status == 0){
                                $('#result-div').text('后台正在处理中，您本次任务的ID为' + res.jobId + '，后台处理需要一定时间，请届时前往历史记录中查看任务详细信息');
                            }else{
                                alert(res.message);
                            }
                        });
                    }
            	}
            	function showNext(){
            		$('.c-div-no-border').find('.c-div').removeClass('hidden').removeClass('show').addClass('hidden');
            		$nextEl.removeClass('hidden').addClass('show');
                    $('.label-ul').find('li').removeClass('active');
                    $('#menu-'+target).addClass('active');
            	}
                function generateTab(api, data, callback){
                    $.ajax({
                        url: me.options[api].url,
                        type: me.options[api].type,
                        dataType: 'json',
                        data: data,
                        success: function(res){
                            callback(res);
                        }
                    });
                }
            });
        }
    };
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    module.exports = cluster;
});