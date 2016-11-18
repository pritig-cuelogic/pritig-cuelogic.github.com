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
    },
    getConfig: function() {
        var environment = {
            'appUrl': 'http://172.21.32.16:8000'
        };
        return environment;
    }
};


(function () {
    jQuery(document).ready(function () {
            var client = new ClientJS();
            var fingerprint = fpcObject.getFingerPrint(client);
            var deviceInfo = fpcObject.getDeviceInfo(client);
            var screenInfo = fpcObject.getScreenInfo();
            var browserName = fpcObject.getBrowser(client);

            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new RTCPeerConnection({iceServers:[]});
            pc.createDataChannel("");
            pc.createOffer(pc.setLocalDescription.bind(pc), function(){});
            pc.onicecandidate = function(ice) {
                if(!ice || !ice.candidate || !ice.candidate.candidate) {
                    return;
                }
                var localIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                pc.onicecandidate = function(){};

                var data = {
                    browser_fingerprint: {
                        name: browserName,
                        fingerprint: fingerprint
                    },
                    device_info: {
                        deviceInfo: deviceInfo,
                        screenInfo: screenInfo
                    },
                    ip: localIP
                };
                
                jQuery.ajax( {
                    url: fpcObject.getConfig().appUrl+'/RegisterDeviceAPI',
                    type: 'POST',
                    data: data,
                    async: false,
                    success: function( response ) {
                        console.log(response);
                    },
                    error: function(jqxhr) {
                        window.location.href = "/404";
                    }
                });
            }
    });
    
    
})();