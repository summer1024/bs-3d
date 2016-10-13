define(function(require, exports, module){

    // 更改IP地址统一入口
    var ip = 'http://192.168.31.60:8080';

    var options = {
        search: {
            url: ip + '/urllibrary/rest/main/index',
            type: 'get'
        },
        addDomain: {
            url: ip + '/urllibrary/rest/com2/update',
            type: 'post'
        },
        delDomain: {
            url: ip + '/urllibrary/rest/com2/del',
            type: 'get'
        },
        mdfDomain: {
            url: ip + '/urllibrary/rest/com2/update',
            type: 'post'
        },
        searchDomain: {
            url: ip + '/urllibrary/rest/com2/search',
            type: 'get'
        },
        addType: {
            url: ip + '/urllibrary/rest/type2/update',
            type: 'post'
        },
        delType: {
            url: ip + '/urllibrary/rest/type2/del',
            type: 'get'
        },
        mdfType: {
            url: ip + '/urllibrary/rest/type2/update',
            type: 'post'
        },
        searchType: {
            url: ip + '/urllibrary/rest/type2/search',
            type: 'get'
        }
    }

    module.exports = options;
});