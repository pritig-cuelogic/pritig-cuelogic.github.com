'use strict';


var fpcObject = {
    getFingerPrint: function (client) {
        var canvasPrint = client.getCanvasPrint();
        var fingerprint = client.getCustomFingerprint(canvasPrint);
        return fingerprint;
    },
    getDeviceInfo: function (client) {
        var os = client.getOS();
        var isMobile = client.isMobile();
        var device;
        if(isMobile) {
        device = 'Mobile';
        }
        else {
        device = 'Desktop';
        }
        var deviceInfo = {
           os: os,
           device: device 
        };
        return deviceInfo;
    },
    getScreenInfo: function () {
        var colorDepth = screen.colorDepth;
        var screenWidth = screen.width;
        var screenHeight = screen.height;
        var screenInfo = {
            screenWidth: screenWidth,
            screenHeight: screenHeight,
            colorDepth: colorDepth
        };
        return screenInfo;
    },
    getBrowser: function (client) {
        var browser = client.getBrowser();
        return browser;
    }

};


(function () {
    jQuery(document).ready(function () {
            var client = new ClientJS();
            var fingerprint = fpcObject.getFingerPrint(client);
            var deviceInfo = fpcObject.getDeviceInfo(client);
            var screenInfo = fpcObject.getScreenInfo();
            var browserName = fpcObject.getBrowser(client);
            console.log(fingerprint);
    });   
    
})();