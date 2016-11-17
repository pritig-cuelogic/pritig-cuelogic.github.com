'use strict';

function getLocalIP (callback) {
    var ip_dups = {};
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    var servers = {iceServers: []};

    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate (candidate) {
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];

        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    pc.onicecandidate = function (ice) {

        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    pc.createDataChannel("");

    pc.createOffer(function(result){

        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

}
var client = new ClientJS();

function getFingerPrint () {
    
    
    var canvasPrint = client.getCanvasPrint();
    
    var fingerprint = client.getCustomFingerprint(canvasPrint);
    
    return fingerprint;
}


function getDeviceInfo () {
    
    var OS = client.getOS();
    var isMobile = client.isMobile();
    var device;
    if(isMobile) {
        device = 'Mobile';
    }
    else {
        device = 'Desktop';
    }
    console.log(device);
    console.log(OS);
}

var browser = client.getBrowser();
console.log(browser);

getDeviceInfo();
var fingerprint = getFingerPrint(); 
console.log(fingerprint);

function getScreenInfo () {
    var colorDepth = screen.colorDepth;
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    console.log(colorDepth);
    console.log(screenWidth);
    console.log(screenHeight);
}

getScreenInfo();
getLocalIP(
    function(ip) {
        console.log(ip);
    });

jQuery.ajax( {
    url: 'http://172.21.32.18:3000',
    type: 'GET',
    async: false,
    success: function( response ) {
        console.log(response);
    },
    error: function(jqxhr) {
           window.location.href = "/404";
          }
} );