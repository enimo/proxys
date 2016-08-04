var page = require('webpage').create();
var testUrl = 'http://www.baidu.com';

page.open(testUrl, function (status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    }
    else {
        if (page.content.indexOf('error') !== -1) {
            console.log('Proxys didn\'t work well...');
            phantom.exit(2);
        }
        else {
            phantom.exit(0);
        }
    }
});
