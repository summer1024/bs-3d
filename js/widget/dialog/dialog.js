define(function(require, exports, module){
    require('./dialog.css');
    var $ = require('../../util/jquery.min.js');
    var isResize;
    $.MsgBox = {
        Alert: function (opt) {
            isResize = 0;
            GenerateHtml("alert", opt);
           //  $("#mb_box").click(function () {
          	//    $("#mb_box,#mb_con").remove();
        	  // });
            btnOk(); //alert只是弹出消息，因此没必要用到回调函数callback
            btnNo();
        },
        Confirm: function (opt) {
            isResize = 0;
            GenerateHtml("confirm", opt);
            btnOk(opt.callback || null);
            btnNo();
        }
    }

    //生成Html
    var GenerateHtml = function (type, opt) {

        var _html = "";

        _html += '<div id="mb_box"></div><div id="mb_con"><div class="ui-dialog-title"><span id="mb_tit">' + (opt.title || '系统信息') + '</span>';
        _html += '<a class="close-btn" id="mb_ico">x</a></div><div id="mb_msg">' + (opt.content || '') + '</div><div id="mb_btnbox">';

        if (type == "alert") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html += '</div></div>';

        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); GenerateCss(type, opt);
    }

    //生成Css
    var GenerateCss = function (type, opt) {
        // 控制弹出框位置
        setSize(opt);
    }


    //确定按钮事件
    var btnOk = function (callback) {
        $("#mb_btn_ok").click(function () {
            if (typeof (callback) == 'function') {
                callback();
            }
            $("#mb_box,#mb_con").remove();
            window.onload = window.onresize = null;
        });
    }

    //取消按钮事件
    var btnNo = function () {
        $("#mb_btn_no,#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
            window.onload = window.onresize = null
        });
    }

    function monitorSize(opt){
        if(isResize === 0){

            window.onload = window.onresize = function(){
                setSize(opt);
            };
        }
        
    }
    function setSize(opt){
        var _width = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高

        var boxWidth = opt.width || 900;
        var boxHeight = $("#mb_con").height();

        if(_height < boxHeight){
            $("#mb_con").css({ 
                width: (opt.width || '900')+'px', 
                top: "10px", 
                left: (_width - boxWidth) / 2 + "px" 
            });
        }else{
            $("#mb_con").css({ 
                width: (opt.width || '900')+'px', 
                top: (_height - boxHeight) / 2 + "px", 
                left: (_width - boxWidth) / 2 + "px" 
            });
        }
        monitorSize(opt);
    }
});