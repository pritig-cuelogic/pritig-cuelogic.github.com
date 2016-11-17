'use strict';

var fpc = {
    init: function () {
        var client = new ClientJS();
        var fingerprint = fpc.getFingerPrint(client);
        var deviceInfo = fpc.getDeviceInfo(client);
        var screenInfo = fpc.getScreenInfo();
        var browserName = fpc.getBrowser(client);
        var pc = fpc.getLocalIP();
            console.log(pc());
        
        },
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
    getLocalIP: function () {
        //return new Promise(function(resolve,reject){
            var RTCPeerConnection = window.RTCPeerConnection
                || window.mozRTCPeerConnection
                || window.webkitRTCPeerConnection;
            var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
            pc.createDataChannel("");
            pc.createOffer(pc.setLocalDescription.bind(pc), noop);
            return pc.onicecandidate = function (ice) {
                if(!ice || !ice.candidate || !ice.candidate.candidate) {
                    return;
                }
                var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                pc.onicecandidate = noop;
                console.log(myIP);
                return myIP;
            };
           
       // });

    },
    getBrowser: function (client) {
        var browser = client.getBrowser();
        return browser;
    }
};

fpc.init();