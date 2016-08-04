/*!
 * To Define proxy configs
 * Baijiahao Proxy Provider
 *
 * @update: 2016.4.9
 * @author: luoqin <enimong@gmail.com>
 * @version 2.1.2
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */
 
module.exports = {
    skipUrl : [// 不进入代理的url, 注: skip_url和track_url互斥，两者都存在配置时，skip_url生效，即跳过skip_url的值，其它url都走代理

        // 'http:\/\/[a-z0-9-]+\.weibo\.com/(.*)+',
        // 'http:\/\/weibo\.com/(.*)+',
        // 'https:\/\/[a-z0-9-]+\.bdimg\.com',

        'http:\/\/[a-z0-9-]+\.bdimg\.com\/(.*)+',
        'http:\/\/[a-z0-9-]+\.bdstatic\.com\/(.*)+',
        'https:\/\/[a-z0-9-]+\.bdstatic\.com',
        'https:\/\/s[a-z][0-9]\.baidu\.com', // wise静态资源

        // 'http:\/\/timg01\.bdimg\.com\/(.*)+',
        // "http:\/\/(\w|\-)+\.baidu\.com\/(.*)+",
        // 'http:\/\/m\.baidu\.com\/(.*)+',
        
    ],
    
    trackUrl : [// 需要进入代理的url，并经过代理服务器请求外网返回数据
        // 'http://*.weixin.qq.com/*',
        // 'http://*.boc.cn/*',
        // 'http:\/\/[a-z0-9-]+\.bdimg\.com\/(.*)+',
        // 'https:\/\/m\.baidu\.com\/(.*)+',
        // 'http:\/\/m\.baidu\.com\/(.*)+',
        'http:\/\/baijiahao\.baidu\.com\/(.*)+',
    ],
    
    blockUrl : [ //进入代理，并劫持返回本地模拟数据
        {
            target: 'http://music.baidu.com/static/js/abc.js',
            dest: '/home/enimo/static/js/abc.js'
        },
        // {
        //  target: 'http://apps.bdimg.com/cloudaapi/lightapp.js',
        //  //dest: '/Users/luoqin/Downloads/new_lightapp.js'
        //  dest: '/Users/luoqin/dev/lightapp/cloudaplus/build/static/cloudaapi/loader.src.js'
        // },
        {
            target: 'http://apps.bdimg.com/libs2/jquery/2.1.1/{*}',
            dest: '/Users/enimo/Downloads/'
        }
        // {
            // target: 'http://img.baidu.com/hunter/alog/alog.mobile.min.js',
            // dest: '/Users/enimo/dev/lightapp/mp-demo/tools/proxys/test/test.js'
        // }
    ],

    skipLogType : 'png|jpeg|woff|ttf|css|js|gif',   // skipLogType 和 trackLogType 互斥，两者都存在配置时skipLogType生效, 即只跳过skipLogType文件类型，其他类型都显示

    trackLogType : 'js',

    delayTime : 0, // 设置的延迟多少毫秒，用于控制模拟网速,如设为：10000

    pacUri : '/',
    port : '9527',

    defaultPublicIP : '192.168.1.100',
    showReqUA : true, // 进入代理时，是否显示请求的QA信息
    showReqCookie : false, // 进入代理时，是否显示请求的cookie信息
    showReqAccept : false, // 进入代理时，是否显示请求的accept信息
    showResHeader : false // 进入代理时，是否显示返回的header头信息
};
