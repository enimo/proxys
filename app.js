#!/usr/bin/env node

/*
Copyright (c) 2013.03
http://weibo.com/enimo

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*!
 * main app entrence
 * @author enimo
 * @version 0.0.1
 */

var http = require('http'),
	cluster = require('cluster'),
	url = require('url'),
	utils = require('./libs/utils');


var cpus = require('os').cpus().length,
    local_addr = '0.0.0.0',
    local_port = 9527,
    proxy_addr = utils.get_local_ip() + ':' + local_port;

if (cluster.isMaster) {

  	// Fork workers.
    for (var i = 0; i < cpus; i++) {
        worker = cluster.fork();
    }

    console.info('master: please use this pac file: http://' + proxy_addr + '/xy.pac');
  
	cluster.on('exit', function(worker, code, signal) {
    	console.log('worker ' + worker.process.pid + ' died');
  	});

} else {
		
	//console.log('before http create');
       
    // Workers can share any TCP connection
  	// In this case its a HTTP server
    http.createServer(function(client_request, client_response) {
	
        console.info(client_request.connection.remoteAddress + ': ' + client_request.method + ' ' + client_request.url);

		//console.log('after http create');

		//broswer's default icon request (may be first)
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

        if (client_request.url === '/xy.pac') {
            client_response.writeHead(200, {
                'Content-Type': 'application/x-ns-proxy-autoconfig'
            });
            client_response.end(utils.get_pac_content(utils.urls, proxy_addr));
            return;
        }

        if (utils.starts_with(client_request.url, 'http')) {
	
            var $url = url.parse(client_request.url); //return an url object
      
        } else {
            client_response.writeHead(500);
            client_response.end();
            return;
        }


       	client_request.headers.host = $url.host;

		var request_options = {
		           host: $url.host,
		           hostname: $url.hostname,
		           port: 80,
		           path: $url.path,
		           method: client_request.method,
		           headers: client_request.headers

		       	};
		
		//console.log('client request:');
		//console.log(request_options);
		
       	var proxy_request = http.request(request_options, function(proxy_response) {
			
            	proxy_response.pipe(client_response);
            	proxy_response.on('error', function(err) {
                	console.error('target server error: ' + err.message);
            	});

            	//console.log('server response:');
            	//console.log(proxy_response.statusCode);
            	//console.log(proxy_response.headers);
            	client_response.writeHead(proxy_response.statusCode, proxy_response.headers);
        });

        client_request.pipe(proxy_request);
        client_request.on('error', function(err) {
            console.error('proxy server error: ' + err.message);
        });

    }).listen(local_port, local_addr);

    console.info('listening on ' + local_addr + ':' + local_port);
}


process.on('uncaughtException', function(err) {
    console.error('worker, caught exception: ' + err);
});
