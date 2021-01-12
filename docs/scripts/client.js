// Replace spaces in search with + to work in url
const replaceSpaces = function(input) {
  let search = input.trim().split(" ").join("+");
  return search;
};

// Creates individual search result
const createMovieElement = function(movieInfo) {
  let $movie = $(`
    <li>
      <div class="listItem">
        <div class="movieInfo">
          <p class="${movieInfo.imdbID}">${movieInfo.Title} (${movieInfo.Year})</p>
        </div>
        <div class="nominateBtn">
          <button type="submit" class="btn nominateMovie" id="${movieInfo.imdbID}">Nominate</button>
        </div>
      </div>
    </li>
  `);

  return $movie;
}

const loadResults = function(req) {
  $('#resultsTitle').empty();
  $('#resultsTitle').html(`Results for "${req}"`);
  
  const movie = replaceSpaces(req);

  $(function() {
    $.ajax(`https://www.omdbapi.com/?s=${movie}&type=movie&apikey=30f52383`, { method: "GET"})
    .then(function(movies) {
      $("#results").empty();
      renderMovies(movies.Search)
    })
  })
}

// Render top 6 results to results box
const renderMovies = function(data) {
  for (let n = 0; n <= 5; n++) {
    let output = createMovieElement(data[n]);
    $(`#results`).append(output);
  }
}

// Render nomination list item
const renderNomination = function(title, id) {
  let $nom = $(`
    <li class="nominationItem">
      <div class="listItem">
        <div class="nomInfo">${title}</div>
        <div class="removeBtn">
          <button type="submit" class="btn btn-cancel" id="nom-${id}">Remove</button>
        </div>
      </div>
    </li>
  `)

  $("#nominations").append($nom);
}

// Class that tracks num of movies nominated
class Nomination {
  constructor() {
    this.count = 0;
    this.ids = [];
  }

  addNomination(id) {
    this.count += 1;
    this.ids.push(id);
  }

  removeNomination(id) {
    this.count -= 1;
    for (let i = 0; i < this.ids.length; i++) {
      if (id === this.ids[i]) {
        this.ids.splice(i, 1);
      }
    }
  }
}

let listItems = new Nomination();

$(document).ready(function() {

  $("#search").on('click', function(event) {
    event.preventDefault();

    const searchText = $("#searchBar").serialize();
    const searchTextRaw = $("#searchBar").val();
    $("#searchBar").val("");
  
    loadResults(searchTextRaw);

  })

})

$(document).on('keypress', function(event) {
  if (event.which === 13) {
    const searchText = $("#searchBar").serialize();
    const searchTextRaw = $("#searchBar").val();
    $("#searchBar").val("");

    loadResults(searchTextRaw);
  }
})

// To add a movie to the nomination list
$(document).on('click', '#results .nominateMovie', function(event) {
  event.preventDefault();
  let imdbID = this.id;

  const title = $(`.${imdbID}`).html();

  if (listItems.ids.includes(imdbID)) {
    $("#nomErr").html("You cannot nominate the same movie twice!");
    $("#nomErr").slideDown("slow");
  } else if (listItems.count === 5) {
    $("#nomErr").html("You may only nominate a maximum of 5 movies");
    $("#nomErr").slideDown("slow");
  } else if (listItems.count === 4) {
    listItems.addNomination(imdbID);
    $(this).addClass("btn-clicked");
    $("#nomErr").slideUp("slow");
    $("#nomErr").html("");
    renderNomination(title, imdbID);
    $("#popup").removeClass("hidden");
  }else if (listItems.count < 5) {
    listItems.addNomination(imdbID);
    $(this).addClass("btn-clicked");
    $("#nomErr").slideUp("slow");
    $("#nomErr").html("");
    renderNomination(title, imdbID);
  }

})

// To remove a nomination
$(document).on('click', '#nominations .btn-cancel', function(event) {
  event.preventDefault();
  let imdbID = this.id.slice(4);
  $(`#${imdbID}`).removeClass("btn-clicked")
  
  listItems.removeNomination(imdbID);
  $("#nomErr").slideUp("slow");
  $("#nomErr").html("");
  
  $(this).closest('li').remove();
})