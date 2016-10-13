define(function(require, exports, module){
    var $ = require('jquery');
    require('bootstrap');
    var bt = require('../../../util/template.js');
    var urlrouter = require('../../url/url.js');
    require('../../dialog/dialog.js');
    var menu = require('../../menu/menu.js');
    var popup = require('../../../popup.js');

    menu.init('interface');

    module.exports = {
        init: function(opt){
            this.bindEvents(opt);
        },
        bindEvents: function(opt){
            $('.url-submit').on('click', function(){
                var url = $.trim($('#url-input').val());

                var param = {
                    url: url
                }

                $.ajax({
                    url: urlrouter.search.url,
                    type: urlrouter.search.type,
                    data: param
                }).done(function(res){
                    res = JSON.parse(res);
                    if(res.errno == 0){
                        // json数据展示
                        $('#json').html('<pre>'+syntaxHighlight(res.data)+'</pre>');
                        // 可视化展示 略
                        
                    }else{
                        popup(res.errmsg);
                    }
                });
            });
        }
    }
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
});