$(document).on('click', '#popup .btn-cancel', function(event) {
  event.preventDefault();

  $("#popup").addClass("hidden");
})

$(document).on('click', '#popup .btn-confirm', function(event) {
  event.preventDefault();

  console.log('done!');
})