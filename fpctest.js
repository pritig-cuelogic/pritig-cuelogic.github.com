'use strict';

var fpc = {
    init: function () {
        var client = new ClientJS();
        var fingerprint = fpc.getFingerPrint(client);
        var deviceInfo = fpc.getDeviceInfo(client);
        var screenInfo = fpc.getScreenInfo();
        var browserName = fpc.getBrowser(client);
        var localIp = fpc.getLocalIP(
            function(ip) {
                console.log(ip);
                
            });
        
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
    getLocalIP: function (callback) {
        var ipDuplicate = {};
        var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var useWebKit = !window.webkitRTCPeerConnection;
        var mediaConstraints = {
            optional: [{RtpDataChannels: true}]
        };
        var servers = {iceServers: []};
        var pc = new RTCPeerConnection(servers, mediaConstraints);

        function handleCandidate (candidate) {
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];
            if(ipDuplicate[ip_addr] === undefined) {
                callback(ip_addr);
            }
            ipDuplicate[ip_addr] = true;
        }
        pc.onicecandidate = function (ice) {
            if(ice.candidate) {
                handleCandidate(ice.candidate.candidate);
            }
        };
        pc.createDataChannel("");
        pc.createOffer(function(result){
            pc.setLocalDescription(result, function(){}, function(){});
        }, function(){});

    },
    getBrowser: function (client) {
        var browser = client.getBrowser();
        return browser;
    }
};

fpc.init();