/**
 * Defined depends utils. for Simple Proxys
 * Baijiahao Proxy Provider
 *
 * @update: 2016.5.9
 * @author: luoqin <enimong@gmail.com>
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */


var cfg = require('../config');
var url = require('url');

;(function (name, factory) {
    if (typeof define === 'function') {
        // AMD/CMD Module
        define(name, factory);
    }
    else if (typeof module !== 'undefined' && module.exports) {
        // Node.js Module
        module.exports = factory();
    }
    else {
        this[name] = factory();
    }
})('proxys.utils', function () {
    function getPublicIP() {
        // get local ip via os networkInterfaces
        try {
            var i;
            var j;
            var interfaces = require('os').networkInterfaces();
            for (i in interfaces) {
                if (interfaces.hasOwnProperty(i)) {
                    for (j = 0; j < interfaces[i].length; j++) {
                        var addr = interfaces[i][j];
                        if (addr.family === 'IPv4' && !addr.internal) {
                            return addr.address;
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log('get local ip err: ', err);
            return false;
        }
        return false; // '127.0.0.1';
    }

    function isPurgeResource(req, res, proxyAddr) {
        // broswer default icon request
        if (req.url === '/favicon.ico') {
            res.writeHead(404);
            res.end();
            return true;
        }

        if (req.url === '/crossdomain.xml') {
            res.writeHead(200, {
                'Content-Type': 'text/xml'
            });
            res.end('<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<cross-domain-policy><allow-access-from domain="*"/></cross-domain-policy>');
            return true;
        }

        if (req.url === cfg.pacUri) {
            res.writeHead(200, {
                'Cache-Control': 'no-cache', // Avoid Cache pac file
                'Content-Type' : 'application/x-ns-proxy-autoconfig'
            });
            res.end(generatePac(proxyAddr));
            log('New pac client connected: ' + req.url + ', [UA: ' + req.headers['user-agent'] + ']');
            return true;
        }

        return false;
    }

    function checkURI(req, res) {
        var $url = {};
        if (firstWord(req.url, 'http')) {   // check是否是HTTP协议，可能是file://协议
            $url = url.parse(req.url);
            return $url;
        }

        log('Unsupport protocol request(such as "file://" etc..): ', req.url);
        res.writeHead(500);
        res.end();
        return false;
    }

    // generate a pac contents
    function generatePac(proxyAddr) {
        // pac语法支持'!'语法， 但不支持'&&' ，因为一次只有一个URL匹配
        var str = 'function FindProxyForURL(url, host) {\n' + '    if (';
        var urls = [];
        var exclude = '';
        var ifRet = '';
        var elseRet = '';
        var AndOr = '||';
        var direct = 'DIRECT';
        var proxy = 'PROXY ' + proxyAddr;

        if (cfg.skipUrl.length !== 0) {    // 当skipUrl和pass_url都不为空时，优先skip生效
            urls = cfg.skipUrl;
            ifRet = direct;
            elseRet = proxy;
        }
        else if (cfg.trackUrl.length !== 0) {
            urls = cfg.trackUrl;
            ifRet = proxy;
            elseRet = direct;
        }
        for (var i = 0, len = urls.length; i < len ; i++) {
            str += exclude + 'shExpMatch(url, "' + urls[i] + '")';
            if (i === len - 1) {
                str += ') {\n';
            }
            else {
                str += ' ' + AndOr + '\n            ';
            }
        }
        str += '        return "' + ifRet + '";\n';// "DIRECT";
        // 此处也可用于cross wall，填入本机局域网ip以及本地的HTTP或者SOCKET用于cross的监听端口
        // return "SOCKS 192.168.1.100:7070"; or "PROXY 192.168.1.100:7070"
        str += '    }\n';
        str += '  return "' + elseRet + '";\n';// 加入白名单的域名不进行代理，默认全部请求走代理
        str += '}';
        return str;
    }

    function log() {
        var apc = Array.prototype.slice;
        var arr = apc.call(arguments);
        arr.unshift('[' + new Date() + ']');
        console && console.log.apply(console, arr);
    }

    // generate a pac contents
    function uriTrackInfo() {
        if (cfg.skipUrl.length !== 0) { // 当skipUrl和pass_url都不为空时，优先skip生效
            return '==== Skipped Uri below ====\n' + cfg.skipUrl.join(' \n');
        }
        else if (cfg.trackUrl.length !== 0) {
            return '==== Tracked Uri below ====\n' + cfg.trackUrl.join(' \n');
        }
        return 'Nothing :(';
    }

    function firstWord(str, substr) {
        return str.slice(0, substr.length) === substr;
    }

    function getHostPortFromString (hostString, defaultPort) {
        var host = hostString || '';
        var port = defaultPort;
        var regexHostport = /^([^:]+)(:([0-9]+))?$/;

        // console.log("=====", hostString, defaultPort);
        var result = regexHostport.exec(hostString);
        if (result != null) {
            host = result[1];
            if (result[2] != null) {
                port = result[3];
            }
        }

        return ([host, port]);
    }

    // get the proxy local ip
    // fixed windows can't get local ip
    // fixed virtual machine can't get real network ip address
    // function getPublicIPRemote() {
    //     var net = require('net');
    //     var socket = net.createConnection(80, 'www.baidu.com');
    //     socket.on('connect', function() {
    //         return socket.address().address;
    //         socket.end();
    //     });
    //     socket.on('error', function(e) {
    //         console.log('socket error:', e);
    //         return false; // '127.0.0.1';
    //     });
    //     return false; // '127.0.0.1';
    // }

    return {
        log : log,
        isPurgeResource : isPurgeResource,
        checkURI : checkURI,
        uriTrackInfo : uriTrackInfo,
        getHostPortFromString : getHostPortFromString,
        getPublicIP : getPublicIP
    };
});
