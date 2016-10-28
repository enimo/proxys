#!/usr/bin/env node
/**
 * Main app entrence of Simple Mobile Proxys
 * Mobile Baidu Proxy Provider
 *
 * @update: 2016.5.8
 * @author: enimo <enimong@gmail.com>
 * @version 2.2.0
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */

var http = require('http');
var utils = require('./libs/utils');
var ssl = require('./libs/ssl');
var track = require('./libs/track');
var hijack = require('./libs/hijack');
var cfg = require('./config');

var localPort = cfg.port;
var localAddr = '0.0.0.0';
var proxyAddr =  (utils.getPublicIP() || cfg.defaultPublicIP) + ':' + cfg.port;

console.log('1. Plant this pac URL in your auto-proxy config: http://' + proxyAddr + cfg.pacUri);
console.log('2. Edit the Package-ROOT/config.js file to add some proxy rules if you want.');


http.createServer()
    .on('connect', ssl.connectTrans) // 透传HTTPS资源
    .on('request', requestCallback) // 抓包处理HTTP资源
    .listen(localPort, localAddr);


function requestCallback(req, res) {

    // Purge disturb resource and check is supported protocol (http/https)
    if (utils.isPurgeResource(req, res, proxyAddr) || !utils.checkURI(req, res)) {
        return false;
    }

    var $url = utils.checkURI(req, res);
    // 获取请求头
    req.headers.host = $url.host;
    var reqOptions = {
        host: $url.host,
        hostname: $url.hostname,
        port: $url.port || 80,
        path: $url.path,
        method: req.method,
        headers: req.headers
    };

    if (track.isTrackURI(req) && track.isTrackType(req)) {
        console.log('---------------');
        utils.log(req.connection.remoteAddress + ' '
                    + req.method + ' '  + res.statusCode + ' '
                    + req.url
        );

        if (cfg.showReqHeader) {
            console.log('==> Client request header:', reqOptions.headers);
        }

        if (cfg.showReqUA) {
            console.log('==> Client UA:', reqOptions.headers['user-agent']);
        }
        if (cfg.showReqCookie && reqOptions.headers.cookie) {
            console.log('==> Client Cookie:', reqOptions.headers.cookie);
        }
        if (cfg.showReqAccept && reqOptions.headers.accept) {
            console.log('==> Client Accept:', reqOptions.headers.accept);
        }
    }

    // 执行劫持植入
    hijack.plant(req, res, $url);

    var proxyRequest = http.request(reqOptions, function(proxyResponse) {

        // 控制请求延时
        setTimeout(function() {
            proxyResponse.pipe(res);
        }, cfg.delayTime || 0);

        proxyResponse.on('error', function(err) {
            console.error('Target server error: ' + err.message);
        });
        if (cfg.showResHeader) {
            utils.log('Server response header: ', proxyResponse.headers);
        }
        res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });

    req.pipe(proxyRequest);
    req.on('error', function(err) {
        console.error('Proxy server error: ' + err.message);
    });

}

console.log('\nCurrent Proxys Rules info: \n', utils.uriTrackInfo());
console.log('\n===== Track Logging ... =====');

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err);
});
