/**
 * Hijack and Plant resources for Simple Proxys
 * Baijiahao Proxy Provider
 *
 * @update: 2016.5.8
 * @author: luoqin <enimong@gmail.com>
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */


var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var cfg = require('../config');
var _ = module.exports;

// 代理劫持后的资源
_.plant = function (req, res, $url) {

    if (cfg.blockUrl.length !== 0) { // 需要劫持的url请求
        for (var i = 0, len = cfg.blockUrl.length; i < len; i++) {
            var target = cfg.blockUrl[i].target;
            var dest = cfg.blockUrl[i].dest;
            if (req.url.indexOf(target.replace('{*}', '')) === -1) {
                continue; // url未命中拦截规则
            }

            utils.log('=== The Url Below Hitted Block Rules: ===\n>>>', req.url);
            // example: $url.path = '/view.php?id=123', $url.pathname = '/view.php';
            var query = $url.path.replace($url.pathname, '');
            var noQueryUrl = req.url.replace(query, '');
            var contentType = 'text/plain';

            // FIX ME: Only support js/css MIME type for now
            if (path.extname(noQueryUrl) === '.js') { // path.extname(param), param must no query.
                contentType = 'application/x-javascript';
            }
            else if (path.extname(noQueryUrl) === '.css') {
                contentType = 'text/css';
            }

            res.writeHead(200, {'Content-Type': contentType});
            if (target.indexOf('{*}') !== -1) { // 使用目录匹配
                var urlPrefix = target.replace('{*}', '');
                var reqPath = noQueryUrl.replace(urlPrefix, '');
                if (fs.existsSync(dest + reqPath)) {
                    utils.log('Directory Matched! Sent file: ' + dest + reqPath);
                    res.end(fs.readFileSync(dest + reqPath));
                }
                else {
                    console.error('ERROR, File: ' + dest + reqPath + ' is not exist!');
                    res.end('');
                }
            }
            else {  // 即使用全文件匹配, 还缺一个根据文件类型来匹配
                if (fs.existsSync(dest)) {
                    utils.log('Fully Matched! Sent file: ' + dest);
                    res.end(fs.readFileSync(dest));
                }
                else {
                    console.error('ERROR, File: ' + dest + ' is not exist!');
                    res.end('');
                }
            }
            utils.log('========== Implanted done ==========\n');
        }
    }
};
