
$(document).on({
    ajaxStart: function() { $("#loading").removeClass("hidden");},
    ajaxStop: function() { $("#loading").addClass("hidden"); }    
});