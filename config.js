/*!
 * This file is used to defined configs.
 * @author enimo
 * @version 0.0.2
 */

module.exports = {
	    skip_url : [ //不进入代理的url, 注: skip_url和track_url互斥，两者都存在配置时，skip_url生效，即跳过skip_url的值，其它url都走代理
	    
			// 'http:\/\/[a-z0-9-]+\.weibo\.com/(.*)+',
			// 'http:\/\/weibo\.com/(.*)+',
			'http:\/\/[a-z0-9-]+\.bdimg\.com\/(.*)+',
			// 'http:\/\/timg01\.bdimg\.com\/(.*)+',
			// "http:\/\/(\w|\-)+\.baidu\.com\/(.*)+",
			'http:\/\/m\.baidu\.com\/(.*)+',
			
		],
		
		track_url : [ // 需要进入代理的url，并经过代理服务器请求外网返回数据
	  		// 'http://*.weixin.qq.com/*',
	  		// 'http://*.boc.cn/*',
			// 'http:\/\/[a-z0-9-]+\.bdimg\.com\/(.*)+',
			'http:\/\/m\.baidu\.com\/(.*)+',
		],
		
		block_url : [ //进入代理，并劫持返回本地模拟数据
			{ 
				target: 'http://music.baidu.com/static/js/abc.js',
				dest: '/home/enimo/static/js/abc.js'
			},
			// { 
			// 	target: 'http://apps.bdimg.com/cloudaapi/lightapp.js',
			// 	//dest: '/Users/luoqin/Downloads/new_lightapp.js'
			// 	dest: '/Users/luoqin/dev/lightapp/cloudaplus/build/static/cloudaapi/loader.src.js'
			// },
			{ 
				target: 'http://apps.bdimg.com/libs2/jquery/2.1.1/{*}',
				dest: '/Users/enimo/Downloads/'
			},
			{ 
				target: 'http://play.baidu.com/static2/{*}',
				dest: '/home/enimo/static/'
			}
		],
		
		skipLogType : 'png|jpg|jpeg|woff|ttf|css|js|gif', 	
		// skipLogType 和 trackLogType 互斥，两者都存在配置时skipLogType生效, 即只跳过skipLogType文件类型，其他类型都显示
		trackLogType : 'js',

		delayTime : 0, // 设置的延迟多少毫秒，用于控制模拟网速,如设为：10000

		pacUri : '/',
		port : '9527',
		
		defaultPublicIP : '192.168.1.100',
		showReqUA : true, //进入代理时，是否显示请求的QA信息
		showReqHeader : false, //进入代理时，是否显示请求的header头信息
		showResHeader : false //进入代理时，是否显示返回的header头信息
}
