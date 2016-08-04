/*!
 * This file is used to defined test functions.
 * @version 0.0.2
 */

// dns
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('virtual addr: ' + add);
});

// socket
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

// os networkInterfaces()
function getLocalIP() {
    try {
        var i;
        var j;
        var interfaces = require('os').networkInterfaces();
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
    }
    catch (err) {
        console.log('get local ip err: ', err);
        return '127.0.0.1';
    }
    return '127.0.0.1';

}

console.log('interface ip: ',getLocalIP());
// (function($_$){})(undefined);
