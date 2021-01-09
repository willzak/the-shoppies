
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

const renderNomination = function(title, id) {
  let $nom = $(`
    <li>
      <div class="nomInfo">${title}</div>
      <div class="removeBtn">
        <button type="submit" class="removeNom" id="${id}">Remove</button>
      </div>
    </li>
  `)

  $("#nominations").append($nom);
}

class Nomination {
  constructor(count) {
    this.count = count;
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

let listItems = new Nomination(0);

$(document).ready(function() {
  console.log(listItems);

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

  if (listItems.count < 5 && !listItems.ids.includes(imdbID)) {
    listItems.addNomination(imdbID);
    $("#nomErr").slideUp("slow");
    $("#nomErr").html("");
    renderNomination(title, imdbID);
  } else if (listItems.count >= 5) {
    $("#nomErr").html("🚨 You may only nominate 5 movies maximum 🚨");
    $("#nomErr").slideDown("slow");
  } else if (listItems.ids.includes(imdbID)) {
    $("#nomErr").html("🚨 You cannot nominate the same movie twice! 🚨");
    $("#nomErr").slideDown("slow");
  }
})

// To remove a nomination
$(document).on('click', '#nominations .removeNom', function(event) {
  event.preventDefault();
  let imdbID = this.id;
  console.log(imdbID)

  listItems.removeNomination(imdbID);
  $("#nomErr").slideUp("slow");
  $("#nomErr").html("");

  $(this).closest('li').remove();
})