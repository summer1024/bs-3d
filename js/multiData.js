define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('./template.js');
    require('./dialog.js');
    require('./jquery.form.js');
    var menu = require('./menu.js');
    //生成菜单 
    menu.init('multiData');
    
    var multiData = {
        init: function(options){
            var me = this;
            me.initTable(options.getSummary);
            var sourceData2 = {//多对象对应不同属性的情况
                "viewId": "tinatest",
                "describe": "淘宝日志二级标签统计",
                "title": "淘宝日志二级标签统计结果",
                "objects": ["商品操作行为","信息管理","栏目与活动","其他","搜索与分类","首页与登录"],
                "property": [
                            ['属性','属性值']
                         ],
                "relationtype":2,
                "relations":{
                    "商品操作行为":[
                            ["购买", 2495],
                            ["评论", 3324],
                            ["浏览", 57368],
                            ["店铺浏览",1865],
                            ["购物车",2630],
                            ["收藏",2475]
                        ],
                    "信息管理":[
                            ["卖家中心", 3716],
                            ["上传", 1224],
                            ["物流", 2672],
                            ["已买到宝贝",19643]
                            ],
                    "栏目与活动":[
                            ["淘金币", 25981],
                            ["手机端",1449],
                            ["爱淘宝", 6077],
                            ["聚划算",5611],
                            ["广告", 1218],
                            ["淘宝试用",14554],
                            ["分销",4637],
                            ["论坛",1350],
                            ["淘宝热卖",913],
                            ["会员",869]
                    ],
                    "其他": [["其他",955]],
                    "搜索与分类":[
                                ["列表页",4826],
                                ["筛选",22016],
                                ["爱淘搜索",1822]
                                ],
                    "首页与登录":[
                                ["首页",8701],
                                ["登录",18037]
                                ]
                }
            }
            DVL('#time-analysis', sourceData2, 1, false);
        },
        initTable: function(opt){
            $.ajax({
                url: opt.url,
                type: opt.type,
                dataType: 'json',
                success: function(res){
                    $('.outline-wrapper').empty().append(bt('table-multi', res));
                }
            });
        }
    };

    module.exports = multiData;
});
