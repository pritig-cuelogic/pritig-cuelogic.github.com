
jQuery.ajax( {
    url: 'http://pritig:3000',
    type: 'GET',
    success: function( response ) {
        // response
    },
    error: function(jqxhr) {
           window.location.href = "/404";
          }
} );