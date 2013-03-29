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
 * This file is used to defined depends utils.
 * @author enimo
 * @version 0.0.1
 */

;(function (name, definition) {
	
  // this is considered "safe":
  var 	hasDefine = typeof define === 'function',
		hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }

})('utils', function () {
	

	var http = require('http'),
	    ori_urls = [
	
	    	'http://play.baidu.com/*',
	    	'http://weibo.com/enimo*'

			];
	
	
	//get the proxy local ip
	//fixed windows can't get local ip
	//fixed virtual machine can't get real network ip address
	function get_local_ip() {
		
		var net = require('net'),		
			socket = net.createConnection(80, 'www.baidu.com');
			
	  	socket.on('connect', function() {
	    	return socket.address().address;
	    	socket.end();
	  	});
	
	  	socket.on('error', function(e) {
	    	console.log('socket error:',e);
	    	return '127.0.0.1';
	
	  	});
	
		return '127.0.0.1';
    
	};

	//first words
	function starts_with(str, substr) {
    	return str.slice(0, substr.length) === substr;
	};


	//generate a pac contents
	function get_pac_content(urls, proxy_addr) {
	
    	var str = 'function FindProxyForURL(url, host) {\n' +
            '    if (';

    	for (var i = 0, len = urls.length; i < len ; i++) {
        	str += 'shExpMatch(url, "' + urls[i] + '")';
        	if (i === len - 1) {
            	str += ') {\n';
        	} else {
            	str += ' ||\n            ';
        	}
    	}

    	str += '        return "DIRECT";\n'; //"PROXY ' + proxy_addr + '";
						//加入白名单的域名不进行代理，默认全部请求走代理
        str += '    }\n';

    	str += '    return "PROXY ' + proxy_addr + '";\n';//"DIRECT";
					//此处也可用于cross wall，填入本机局域网ip以及本地的HTTP或者SOCKET用于cross的监听端口
					//return "SOCKS 192.168.1.100:7070"; or "PROXY 192.168.1.100:7070"
					//Read more: https://github.com/enimo/ssh
        str += '}';

    	return str;
	};

	
	
	//ori urls to regx expression
	//useless now 
	function str2regx(urls) {
		var regx_urls = [], regx;
		for (var i = 0, len = urls.length; i < len; i++) {
		        regx = urls[i].replace(/\//g, '\\/')
									.replace(/\./g, '\\.')
									.replace(/\*/g, '.*');
		      
		        regx_urls.push(new RegExp('^' + regx, 'i'));
		}
		
		return regx_urls;
	};
	
	
	return {
		
		urls 			: ori_urls, //or str2regx(ori_urls) if need regex expression
		starts_with 	: starts_with,
		get_local_ip 	: get_local_ip,
		get_pac_content : get_pac_content
	};
	
});