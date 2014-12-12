#!/usr/bin/env node
/*!
 * main app entrence
 * @author enimo
 * @version 0.0.2
 */

var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	utils = require('./libs/utils'),
	cfg = require('./config');

var cpus = require('os').cpus().length,
    local_port = cfg.port,
	pac_uri = cfg.pacUri,
	public_ip = utils.getPublicIP2() || cfg.defaultPublicIP,
    proxy_addr =  public_ip + ':' + local_port,
    local_addr = '0.0.0.0';

utils.log("Plant this pac URL in your proxy config: http://" + proxy_addr + pac_uri);

http.createServer(function(client_request, client_response) {
	//broswer default icon request
	if (client_request.url === '/favicon.ico') {
	            client_response.writeHead(404);
	            client_response.end();
	            return;
	 }	
    if (client_request.url === '/crossdomain.xml') {
        client_response.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        client_response.end('<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<cross-domain-policy><allow-access-from domain="*"/></cross-domain-policy>');
        return;
    }

    if (client_request.url === pac_uri) {
        client_response.writeHead(200, {
			'Cache-Control': 'no-cache', // Avoid Cache pac file
            'Content-Type' : 'application/x-ns-proxy-autoconfig'
        });
        client_response.end(utils.generatePac(proxy_addr));
        return;
    }

	var $url = {};
	if (utils.firstWord(client_request.url, 'https')) {
		utils.log('Unsupport HTTPS request: ', client_request.url);
        client_response.writeHead(500);
        client_response.end();
        return;
	}
    else if (utils.firstWord(client_request.url, 'http')) { // check是否是HTTP协议，可能是file://协议
         $url = url.parse(client_request.url); 
    }
	else {
		utils.log('Unsupport protocol request(such as "file://" etc..): ', client_request.url);
        client_response.writeHead(500);
        client_response.end();
        return;
    }

	if (
		(	cfg.skipLogType 
			&& 
			!client_request.url.match(new RegExp('\.('+ cfg.skipLogType +')', 'g'))
		)
		||
		(	cfg.trackLogType 
			&& 
			client_request.url.match(new RegExp('\.('+ cfg.trackLogType +')', 'g'))
		)
		
		) {
    		utils.log(client_request.connection.remoteAddress + ': ' 
					+ client_request.method + ' ' 
					+ client_request.url
			);
	}
	
   	client_request.headers.host = $url.host;
	var request_options = {
	           host: $url.host,
	           hostname: $url.hostname,
	           port: $url.port || 80,
	           path: $url.path,
	           method: client_request.method,
	           headers: client_request.headers
	};
	
	if (cfg.showReqHeader) {
		utils.log('Client request header:', request_options.headers);
	}
	if (cfg.showReqUA) {
		utils.log('Client request UserAgent:', request_options.headers['user-agent']);
	}
	
	if (cfg.block_url.length !== 0) { // 需要劫持的url请求
		for (var i = 0, len = cfg.block_url.length; i < len; i++) {
			var target = cfg.block_url[i].target,
				dest = cfg.block_url[i].dest;
			if (client_request.url.indexOf(target.replace('{*}', '')) === -1) { 
				continue; //url未命中拦截规则
			}
			
			utils.log("=== The Url Below Hitted Block Rules: ===\n>>>", client_request.url);
			// example: $url.path = '/view.php?id=123', $url.pathname = '/view.php';
			var query = $url.path.replace($url.pathname, '');
			var noQueryUrl = client_request.url.replace(query, '');
			var contentType = 'text/plain';

			// FIX ME: Only support js/css MIME type for now
			if (path.extname(noQueryUrl) === '.js') { // path.extname(param), param must no query.
				contentType = 'application/x-javascript';
			}
			else if (path.extname(noQueryUrl) === '.css') {
				contentType = 'text/css';
			}
			
			client_response.writeHead(200, { 'Content-Type': contentType });
			if (target.indexOf('{*}') !== -1) { // 使用目录匹配
				var url_prefix = target.replace('{*}', ''),
					req_path = noQueryUrl.replace(url_prefix, '');
				if (fs.existsSync(dest + req_path)) {
					utils.log("Directory Matched! Sent file: " + dest + req_path);
					client_response.end(fs.readFileSync(dest + req_path));
				}
				else {
					console.error('ERROR, File: ' + dest + req_path + ' is not exist!');
					client_response.end('');	
				}
			}
			else { // 即使用全文件匹配, 还缺一个根据文件类型来匹配
				if (fs.existsSync(dest)) {
					utils.log("Fully Matched! Sent file: " + dest);
					client_response.end(fs.readFileSync(dest));
				}
				else {
					console.error('ERROR, File: ' + dest + ' is not exist!');
					client_response.end('');	
				}
			}
			utils.log("========== Implanted done ==========\n");
		}
	}
			
   	var proxy_request = http.request(request_options, function(proxy_response) {
        	proxy_response.pipe(client_response);
        	proxy_response.on('error', function(err) {
            	console.error('Target server error: ' + err.message);
        	});
			if (cfg.showResHeader) {
            	utils.log('Server response header: ', proxy_response.headers);
			}
        	client_response.writeHead(proxy_response.statusCode, proxy_response.headers);
    });

    client_request.pipe(proxy_request);
    client_request.on('error', function(err) {
        console.error('Proxy server error: ' + err.message);
    });

}).listen(local_port, local_addr);

//utils.log('Proxys listening port: ' + local_port);
utils.log("\nProxys Rules info: \n", utils.uriTrackInfo());
utils.log("\n===== Track Logging ... =====");

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err);
});
