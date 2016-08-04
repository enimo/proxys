/**
 * Track resources for Simple Proxys
 * Baijiahao Proxy Provider
 *
 * @update: 2016.5.8
 * @author: luoqin <enimong@gmail.com>
 * @see: README.md
 * @formatter & jslint: fecs xx.js --check
 */


var cfg = require('../config');
var _ = module.exports;

// uri过滤规则
_.isTrackURI = function (req) {

    var isTrack = true;
    var reg = '';
    if (cfg.skipUrl.length) {
        for (var i = cfg.skipUrl.length - 1; i >= 0; i--) {
            reg = cfg.skipUrl[i];
            if (req.url.match(new RegExp(reg, 'g'))) {
                isTrack = false;
                // utils.log('====skipUrl now : ' + reg);
                break;
            }
        }
    }
    else if (cfg.trackUrl.length) {
        for (var m = cfg.trackUrl.length - 1; m >= 0; m--) {
            reg = cfg.trackUrl[m];
            if (!req.url.match(new RegExp(reg, 'g'))) {
                isTrack = false;
            }
        }
    }

    return isTrack;
};

// 文件过滤规则
_.isTrackType = function (req) {

    var isTrack = (cfg.skipLogType && !req.url.match(new RegExp('\.(' + cfg.skipLogType + ')', 'g')))
                    ||
                    (!cfg.skipLogType  // skipLogType 和 trackLogType 互斥，两者都存在配置时, skipLogType生效
                    &&
                    cfg.trackLogType
                    &&
                    req.url.match(new RegExp('\.(' + cfg.trackLogType + ')', 'g'))
                    );

    return isTrack;
};
