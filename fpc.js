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
        var env = {
            'appUrl': 'http://172.21.32.16:8000'
        };
        return env;
    },
    getCookie: function (name) {
        var dc = document.cookie;
        var prefix = name + '=';
        var begin = dc.indexOf('; ' + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) {
                return null;    
            } 
        }
        else {
            begin += 2;
            var end = document.cookie.indexOf(';', begin);
            if (end == -1) {
               end = dc.length; 
            }
             
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    },
    setCookie: function (key,value) {
        var everCookie = new evercookie({});
        everCookie.set(key, value); 
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
                var localIp = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                pc.onicecandidate = function(){};
                var uuId = fpcObject.getCookie('uuid');
                var sessionId = fpcObject.getCookie('sessionid');
                if(uuId && sessionId) {
                    var data = {
                            "browser_fingerprint": JSON.stringify({
                                "name": browserName,
                                "fingerprint": fingerprint
                            }) ,
                            "session_id": sessionId,
                            "device_id": uuId,
                            "ip": localIp
                    };
                    console.log("hhhh");
                }
                else {
                    var data = {
                            "browser_fingerprint": JSON.stringify({
                                "name": browserName,
                                "fingerprint": fingerprint
                            }) ,
                            "device_info": JSON.stringify({
                                "deviceInfo": deviceInfo,
                                "screenInfo": screenInfo
                            }),
                            "ip": localIp
                    };
                        
                }
                jQuery.ajax({
                        url: fpcObject.getConfig().appUrl+'/register_device',
                        type: 'POST',
                        dataType: "json",                  
                        data: data ,
                        async: false,
                        success: function( response ) {
                            console.log(response);                       
                            fpcObject.setCookie('uuid',response.UUID);
                            fpcObject.setCookie('sessionid',response.SessionID);
                        },
                        error: function(err) {
                            console.log(err.statusText);
                            //window.location.href = "/404";
                        }
                });
                
              
            }
    });
    
    
})();