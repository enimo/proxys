#!/usr/bin/env node
/*!
 * main app entrence
 * @author enimo
 * @version 0.0.2
 */

var http = require('http'),
	url = require('url'),
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
	//broswer's default icon request
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
		utils.log('Unsupport protocol request(such as file:// etc..): ', client_request.url);
        client_response.writeHead(500);
        client_response.end();
        return;
    }

	var _patterns = new RegExp('\.('+ cfg.filterLogType +')', 'g'); // new Regexp(/\.()/g);
	if (!client_request.url.match(_patterns)) {
    	utils.log(client_request.connection.remoteAddress + ': ' 
				+ client_request.method + ' ' 
				+ client_request.url
		);
		utils.log("$url: ", $url); //protocol 
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
	
	if (cfg.block_url.length !== 0) { // 需要劫持的url请求
		for (var i = 0, len = cfg.block_url.length; i < len; i++) {
			var target = cfg.block_url[i].target,
				dest = cfg.block_url[i].dest;
			if (client_request.url.indexOf(target.replace('{*}', '')) === -1) { //url未命中
				continue;
			}
			
			if (target.indexOf('{*}') !== -1) { // 即使用目录匹配
				var url_prefix = target.replace('{*}', '');
				var req_path = client_request.url.replace(url_prefix, '');
				client_response.writeHead(200, { 'Content-Type': 'text/plain' });
				client_response.end(utils.getfile(dest + req_path));
			}
			else { // 即使用全文件匹配
				client_response.end(utils.getfile(dest));
			}
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
