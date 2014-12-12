/*!
 * This file is used to defined depends utils.
 * @author enimo
 * @version 0.0.2
 */

var	cfg = require('./config'),
	http = require('http'),
	_ = module.exports;

;(function (name, factory) {
  	if (typeof define === 'function') {
    	// AMD/CMD Module
    	define(factory);
  	} else if (typeof module !== 'undefined' && module.exports) {
    	// Node.js Module
    	_ = definition();
  	} else {
    	this[name] = definition();
  	}
})('proxys.utils', function () {

	//get the proxy local ip
	//fixed windows can't get local ip
	//fixed virtual machine can't get real network ip address
	function get_local_ip1() {	
		var net = require('net'),		
			socket = net.createConnection(80, 'www.baidu.com');	
	  	socket.on('connect', function() {
	    	return socket.address().address;
	    	socket.end();
	  	});
	  	socket.on('error', function(e) {
	    	console.log('socket error:', e);
	    	return '127.0.0.1';
	
	  	});
		return '127.0.0.1';
	}
	
	//get local ip via os networkInterfaces()
	function get_local_ip2() {
		try {
	    	var i, j, interfaces = require('os').networkInterfaces();
			//console.log(interfaces);
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
		} catch (err) {
			console.log("get local ip err: ", err);
	    	return '127.0.0.1';
		}
		return '127.0.0.1';
	}

	//first words
	function firstWord(str, substr) {
    	return str.slice(0, substr.length) === substr;
	}

	//generate a pac contents
	function generatePac(config_urls, proxy_addr) {
    	var str = 'function FindProxyForURL(url, host) {\n' + '    if (';
    	for (var i = 0, len = config_urls.length; i < len ; i++) {
        	str += 'shExpMatch(url, "' + config_urls[i] + '")';
        	if (i === len - 1) {
            	str += ') {\n';
        	} else {
            	str += ' ||\n            ';
        	}
    	}
    	str += '        return "DIRECT";\n'; //加入白名单的域名不进行代理，默认全部请求走代理
        str += '    }\n';

    	str += '    return "PROXY ' + proxy_addr + '";\n';//"DIRECT";
					//此处也可用于cross wall，填入本机局域网ip以及本地的HTTP或者SOCKET用于cross的监听端口
					//return "SOCKS 192.168.1.100:7070"; or "PROXY 192.168.1.100:7070"
        str += '}';

    	return str;
	}
	
	return {
		firstWord 		: firstWord,
		generatePac		: generatePac,
		get_local_ip1 	: get_local_ip1,
		get_local_ip2 	: get_local_ip2
	};
	
});