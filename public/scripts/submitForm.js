$(document).on('click', '#popup .btn-cancel', function(event) {
  event.preventDefault();

  $("#popup").addClass("hidden");
})

$(document).on('click', '#popup .btn-confirm', function(event) {
  event.preventDefault();

  $(".results-list").addClass("hidden");
  $(".nominations-list").addClass("hidden");
  $(".searchBox").addClass("hidden");

  $("#popup").html("<h2>Thank You For Your Submission!</h2><p>Your nominations have been counted for the 2021 Shoppies Awards!</p>")
})