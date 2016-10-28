/**
 * HTTPS/SSL Transmission for Simple Proxys
 * Baijiahao Proxy Provider
 *
 * @update: 2016.5.9
 * @author: luoqin <enimong@gmail.com>
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */


var net = require('net');
var utils = require('./utils');
var cfg = require('../config');
var _ = module.exports;


// 针对HTTPS的代理支持, 但无法做替换和内容区域的解密
_.connectTrans = function(req, socket, bodyhead) {

    var hostPort = utils.getHostPortFromString(req.url, 443);
    var hostDomain = hostPort[0];
    var port = parseInt(hostPort[1], 10);
    var reg = '';

    var isTrackHTTPS = true;
    if (cfg.skipUrl.length) {
        for (var i = cfg.skipUrl.length - 1; i >= 0; i--) {
            reg = cfg.skipUrl[i].replace('https:\/\/', '');
            // console.log('====' + hostDomain + '==' + reg);
            if (hostDomain.match(new RegExp(reg, 'g'))) {
                isTrackHTTPS = false;
                break;
            }
        }
    }
    else if (cfg.trackUrl.length) {
        for (var m = cfg.trackUrl.length - 1; m >= 0; m--) {
            reg = cfg.trackUrl[m].replace('https:\/\/', '');
            if (!hostDomain.match(new RegExp(reg, 'g'))) {
                isTrackHTTPS = false;
            }
        }
    }

    if (isTrackHTTPS) {
        console.log('-------------HTTPS');
        // console.log('Proxying HTTPS request for:', hostDomain, port);
        utils.log(req.connection.remoteAddress + ' '
                + req.method + ' '
                + req.url
        );
        if (cfg.showReqUA) {
            console.log('==> Client UA:', req.headers['user-agent']);
        }
    }

    var proxySocket = new net.Socket();
    proxySocket.connect(port, hostDomain, function () {
        proxySocket.write(bodyhead);
        socket.write('HTTP/' + req.httpVersion + ' 200 Connection established\r\n\r\n');
    });

    proxySocket.on('data', function (chunk) {
        socket.write(chunk);
    });

    proxySocket.on('end', function () {
        socket.end();
    });

    proxySocket.on('error', function () {
        socket.write('HTTP/' + req.httpVersion + ' 500 Connection error\r\n\r\n');
        socket.end();
    });

    socket.on('data', function (chunk) {
        proxySocket.write(chunk);
    });

    socket.on('end', function () {
        proxySocket.end();
    });

    socket.on('error', function () {
        proxySocket.end();
    });

};
