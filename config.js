/*!
 * This file is used to defined configs.
 * @author enimo
 * @version 0.0.2
 */

module.exports = {
	    skip_url : [ //不进入代理的url, 注: skip_url和pass_url互斥，两者都存在配置时，skip_url生效，即跳过skip_url的值，其它url都走代理
	    	/*
			'http://*.weibo.com/*',
			'http://weibo.com/*',
	    	'http://*.weibo.cn/*',
			'http://weibo.cn/*',
			'http://*.sina.cn/*',
			'http://sina.cn/*',
			'http://*.sina.com.*',
			'http://sina.com.*'
			*/
		],
		
		track_url : [ //进入代理，并经过代理服务器请求外网返回数据
	    	'http://*.weixin.qq.com/*',
	    	'http://*.boc.cn/*',
			'http://*.bdimg.com/*',
			'http://m.baidu.com/static/*'
		],
		
		block_url : [ //进入代理，并劫持返回本地模拟数据
			{ 
				target: 'http://music.baidu.com/static/js/abc.js',
				dest: '/home/enimo/static/js/abc.js'
			},
			{ 
				target: 'http://apps.bdimg.com/cloudaapi/lightapp.js',
				dest: '/Users/enimo/Downloads/test_lightapp.js'
			},
			{ 
				target: 'http://apps.bdimg.com/libs/jquery/2.1.1/{*}',
				dest: '/Users/enimo/Downloads/'
			},
			{ 
				target: 'http://play.baidu.com/static/{*}',
				dest: '/home/enimo/static/'
			}
		],
		
		skipLogType : 'png|jpg|jpeg|gif|woff|ttf',
		//trackLogType : 'css|js',
		pacUri : '/',
		port : '9527',
		
		defaultPublicIP : '192.168.1.100',
		showReqUA : false,
		showReqHeader : false, //进入代理时，是否显示请求的header头信息
		showResHeader : false //进入代理时，是否显示返回的header头信息
}