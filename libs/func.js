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
 * This file is used to defined common functions.
 * @author enimo
 * @version 0.0.1
 */

//dns
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('virtual addr: '+add);
	//will get virtual machine's ip
})

//socket
function getNetworkIP(callback) {
  var net = require('net');
  var socket = net.createConnection(80, 'www.baidu.com');

  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });

  socket.on('error', function(e) {
    callback(e, 'error');
  });
}

getNetworkIP(function (error, ip) {
    console.log('socket ip: ',ip);
    if (error) {
        console.log('error:', error);
    }
});


//os networkInterfaces()
function get_local_ip() {
	
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
    	return '127.0.0.1';
	}

	return '127.0.0.1';

};

console.log('interface ip: ',get_local_ip());

;(function($_$){})(undefined);