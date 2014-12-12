/*!
 * This file is used to defined configs.
 * @author enimo
 * @version 0.0.2
 */

module.exports = {
	    skip_url : [ //不进入代理的url, 注: skip_url和pass_url互斥，两者都存在配置时，skip_url生效，即跳过skip_url的值，其它url都走代理
	    	
			'http://*。weibo.com/*',
			'http://weibo.com/*',
	    	'http://*.weibo.cn/*',
			'http://weibo.cn/*',
			'http://*.sina.cn/*',
			'http://sina.cn/*',
			'http://*.sina.com.*',
			'http://sina.com.*'
			
		],
		
		track_url : [ //进入代理，并经过代理服务器请求外网返回数据
	    	'http://*.weixin.qq.com/*',
	    	'http://*.boc.cn/*'
		],
		
		block_url : [ //进入代理，并劫持返回本地模拟数据
			{ 
				target: 'http://music.baidu.com/static/js/abc.js',
				dest: '/home/bae/static/js/abc.js'
			},
			{ 
				target: 'http://play.baidu.com/static/{*}',
				dest: '/home/bae/static/'
			}
		],
		
		filterLogType : 'png|jpg|jpeg|gif|woff|ttf',
		pacUri : '/',
		port : '9527',
		
		defaultPublicIP : '192.168.1.100',
		showReqHeader : false, //进入代理时，是否显示请求的header头信息
		showResHeader : false //进入代理时，是否显示返回的header头信息
}