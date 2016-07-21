/*!
 * This file is used to defined depends utils.
 * @author enimo
 * @version 0.0.2
 */

var	cfg = require('../config'),
	http = require('http');

;(function (name, factory) {
  	if (typeof define === 'function') {
    	// AMD/CMD Module
    	define(name, factory);
  	} else if (typeof module !== 'undefined' && module.exports) {
    	// Node.js Module
    	module.exports = factory();
  	} else {
    	this[name] = factory();
  	}
})('proxys.utils', function () {
	//get the proxy local ip
	//fixed windows can't get local ip
	//fixed virtual machine can't get real network ip address
	function getPublicIP1() {	
		var net = require('net'),		
			socket = net.createConnection(80, 'www.baidu.com');	
	  	socket.on('connect', function() {
	    	return socket.address().address;
	    	socket.end();
	  	});
	  	socket.on('error', function(e) {
	    	console.log('socket error:', e);
	    	return false; // '127.0.0.1';
	
	  	});
		return false; // '127.0.0.1';
	}
	
	//get local ip via os networkInterfaces()
	function getPublicIP2() {
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
	    	return false;
		}
		return false; // '127.0.0.1';
	}

	//first words
	function firstWord(str, substr) {
    	return str.slice(0, substr.length) === substr;
	}

	//generate a pac contents
	function generatePac(proxy_addr) {
		// pac语法支持'!'语法， 但不支持'&&' ，因为一次只有一个URL匹配
    	var str = 'function FindProxyForURL(url, host) {\n' + '    if (',
			urls = [],
			exclude = '',
			AndOr = '||',
			direct = "DIRECT",
			proxy = "PROXY " + proxy_addr;
			
		if (cfg.skip_url.length !== 0) { // 当skip_url和pass_url都不为空时，优先skip生效
			urls = cfg.skip_url;
			ifRet = direct;
			elseRet = proxy;
		}
		else if (cfg.track_url.length !== 0) {
			urls = cfg.track_url;
			ifRet = proxy;
			elseRet = direct;
		}
    	for (var i = 0, len = urls.length; i < len ; i++) {
        	str += exclude + 'shExpMatch(url, "' + urls[i] + '")';
        	if (i === len - 1) {
            	str += ') {\n';
        	} else {
            	str += ' '+ AndOr +'\n            ';
        	}
    	}
    	str += '    	return "'+ ifRet +'";\n';//"DIRECT";
						// 此处也可用于cross wall，填入本机局域网ip以及本地的HTTP或者SOCKET用于cross的监听端口
						// return "SOCKS 192.168.1.100:7070"; or "PROXY 192.168.1.100:7070"				
        str += '    }\n';
    	str += '  return "'+ elseRet +'";\n';// 加入白名单的域名不进行代理，默认全部请求走代理
        str += '}';
    	return str;
	}
	
	function log() {
	    var apc = Array.prototype.slice;
	    var arr = apc.call(arguments);
	    arr.unshift('[' + new Date() +']');
	    
	    console && console.log.apply(console, arr);
	}
	
	//generate a pac contents
	function uriTrackInfo() {
		if (cfg.skip_url.length !== 0) { // 当skip_url和pass_url都不为空时，优先skip生效
			return "==== Skipped Uri below ====\n" + cfg.skip_url.join(" \n");
		}
		else if (cfg.track_url.length !== 0) {
			return "==== Tracked Uri below ====\n" + cfg.track_url.join(" \n");
		}
		return 'Nothing :(';
	}


	function getHostPortFromString (hostString, defaultPort) {
	  var host = hostString;
	  var port = defaultPort;
	  var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

	  var result = regex_hostport.exec(hostString);
	  if (result != null) {
	    host = result[1];
	    if (result[2] != null) {
	      port = result[3];
	    }
	  }

	  return ( [host, port] );
	}
	
	return {
		log 		 : log,
		firstWord 	 : firstWord,
		generatePac	 : generatePac,
		uriTrackInfo : uriTrackInfo,
		getHostPortFromString : getHostPortFromString,
		getPublicIP1 : getPublicIP1,
		getPublicIP2 : getPublicIP2
	};
	
});