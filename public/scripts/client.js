
// Replace spaces in search with + to work in url
const replaceSpaces = function(input) {
  let search = input.trim().split(" ").join("+");
  return search;
};

// Creates individual search result
const createMovieElement = function(movieInfo) {
  let $movie = $(`
    <li>
      <div class="movieInfo">
        <p class="${movieInfo.imdbID}">${movieInfo.Title} (${movieInfo.Year})</p>
      </div>
      <div class="nominateBtn">
        <button type="submit" class="nominateMovie" id="${movieInfo.imdbID}">Nominate</button>
      </div>
    </li>
  `);

  return $movie;
}

// Render top 6 results to results box
const renderMovies = function(data) {
  for (let n = 0; n <= 5; n++) {
    let output = createMovieElement(data[n]);
    $(`#results`).append(output);
  }
}

const renderNomination = function(nomInfo) {
  let $nom = $(`
    <li>
      <div class="nomInfo">${nomInfo}</div>
      <div class="removeBtn">
        <button type="submit" class="removeNom">Remove</button>
      </div>
    </li>
  `)
  console.log(nomInfo)
  $("#nominations").append($nom);
}

let listItems = 0;

$(document).ready(function() {

  const loadResults = function(req) {
    const movie = replaceSpaces(req);

    $(function() {
      $.ajax(`http://www.omdbapi.com/?s=${movie}&apikey=30f52383`, { method: "GET"})
      .then(function(movies) {
        $("#results").empty();
        renderMovies(movies.Search)
      })
    })
  }

  $("#search").on('click', function(event) {
    event.preventDefault();

    const searchText = $("#searchBar").serialize();
    const searchTextRaw = $("#searchBar").val();
    $("#searchBar").val("");

    loadResults(searchTextRaw);
  })

})

// To add a movie to the nomination list
$(document).on('click', '#results .nominateMovie', function(event) {
  event.preventDefault();

  let imdbID = this.id;

  const title = $(`.${imdbID}`).html();

  listItems += 1;

  if (listItems < 6) {
    $("#nomErr").html("")
    renderNomination(title);
  } else {
    $("#nomErr").html("🚨 You may only nominate 5 movies maximum 🚨")
    $("#nomErr").slideDown("slow");
  }
})

// To remove a nomination
$(document).on('click', '#nominations .removeNom', function(event) {
  event.preventDefault();
  if (listItems < 6) {
    $("#nomErr").html("")
  }
  listItems -= 1;
  console.log(listItems)

  $(this).closest('li').remove();
})