var http = require('http');
var https = require('https');

var options = {
    // hostname : '172.24.27.58',
    hostname : '127.0.0.1',
    port     : 9529,
    // path     : 'imququ.com:80',
    path     : 'baidu.com:80/post/web-proxy-2.html',
    method     : 'CONNECT'
};

//禁用证书验证，不然自签名的证书无法建立 TLS 连接
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var req = https.request(options);
// var req = http.request(options);

req.on('connect', function(res, socket) {
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: baidu.com\r\n' +
                 'Connection: Close\r\n' +
                 '\r\n');

    socket.on('data', function(chunk) {
        console.log(chunk.toString());
    });

    socket.on('end', function() {
        console.log('socket end.');
    });

    socket.on('error', function (e) {
        console.log('socket error', e);
    });

});

req.end();