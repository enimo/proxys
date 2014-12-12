var page = require('webpage').create();

var test_url = 'http://www.baidu.com';

page.open(test_url, function (status) {
    if (status !== 'success') {
        console.error('Failed in opening page...');
        phantom.exit(1);
    } else {
        if (page.content.indexOf('error') !== -1) {
            console.log("Proxys didn't work well...");
            phantom.exit(2);
        } else {
            phantom.exit(0);
        }
    }
});