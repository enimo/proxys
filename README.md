#Proxys (Easy Http Proxy)

A easy way to share your PC network to mobile device, and capture network traffic to debug mobile app.

Proxys help developer easy to share their local pc network to mobile device, and supply with a convenient method to debug and capture the http request header information  from you mobile.

## Usage

It's depends on Node, and then just playing like this:

### Installing npm (node package manager)

```
curl https://npmjs.org/install.sh | sh
```

### Installing Proxys

```
npm install -g proxys
```
### Using Proxys
```
proxys
```
and then follow the tips below:
```shell
1. Plant this pac URL in your auto-proxy config: http://192.168.1.111:9527/
2. Edit the ROOT/config.js file to add some proxy rules if you want.

Current Proxys Rules info:
 ==== Skipped Uri below ====
http://*.weibo.com/* 
http://weibo.com/* 

===== Track Logging ... =====
```
Add the proxy pac file address on your mobile network panel, and once more, enjoy it.

### Add skip URI

Edit ROOT/config.js file, add uri to skip_url array:
```javascript
module.exports = {
 skip_url : [ 
    	
		'http://*.weibo.com/*',
		'http://weibo.com/*',
    	'http://*.weibo.cn/*',
		'http://weibo.cn/*',
		'http://*.sina.cn/*',
		'http://sina.cn/*',
		'http://*.sina.com.*',
		'http://sina.com.*'
		
	]
}
```
Notice:

1. skip_url为不进入代理的url列表;

2. skip_url和pass_url互斥，两者都存在配置时，skip_url生效，即跳过skip_url的值，其它url都走代理.

### Add track URI

Edit ROOT/config.js file, add uri to track_url array:
```javascript
module.exports = {
	track_url : [ 
    	'http://*.weixin.qq.com/*',
    	'http://*.boc.cn/*'
	],
}
```
Notice: track_url中的uri列表会进入代理，并经过代理服务器请求外网返回数据.

### Add block URL

Edit ROOT/config.js file, add url to block_url array:
```javascript
module.exports = {
	block_url : [ 
		{ 
			target: 'http://music.baidu.com/static/js/abc.js',
			dest: '/home/enimo/static/js/abc.js'
		},
		{ 
			target: 'http://play.baidu.com/static/{*}',
			dest: '/home/enimo/static/'
		}
	]
}
```
Notice:

1. block url列表将进入代理，并劫持后返回本地模拟数据;

2. 支权目录匹配和单文件匹配.

### Additional info

1. Not even 80 port, support any 1000+ port.
2. Unsupport https protocol now.

## Notes

Especially note for Mac OS X user:

Proxys' suggested partner HTTPScoop (http://www.tuffcode.com/download.html), It's one of your best matches.

## Future 

I'll keep polishing this app and keep adding new features. If you have any problems when using this engine, please feel free to drop me an issue or contact me:

* Twitter: https://twitter.com/enimo
* Weibo: http://weibo.com/enimo





