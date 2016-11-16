
function getLocalIP(callback){
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

    function handleCandidate(candidate){
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];

        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    pc.onicecandidate = function(ice){

        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    pc.createDataChannel("");

    pc.createOffer(function(result){

        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});

}

getLocalIP(function(ip){console.log(ip);});

jQuery.ajax( {
    url: 'http://pritig:3000',
    type: 'GET',
    success: function( response ) {
        console.log(response);
    },
    error: function(jqxhr) {
           window.location.href = "/404";
          }
} );