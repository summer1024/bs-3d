define(function(require, exports, module){
    require('../css/popup.css');
    var $ = require('./util/jquery.min.js');

    module.exports = function(msg){
        $pop = $('<div class="ui-popup"></div>');
        $pop.append(msg);

        $('body').append($pop);
        $pop.fadeIn(200);

        var timeout = setTimeout(function(){
            clearTimeout(timeout);
            $pop.fadeOut(200);
            var removeTime = setTimeout(function(){
                clearTimeout(removeTime);
                $pop.remove();
            }, 300);
        }, 1000);
    }
});