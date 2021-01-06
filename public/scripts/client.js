const request = require('request');

// Replace spaces in search with + to work in url
const replaceSpaces = (input) => {
  let search = input.trim().split(" ").join("+");
  return search;
};

// Fetch movie titles from the OMDB API as an array of objects
const searchTitle = (input) => {
  const movie = replaceSpaces(input);

  request(`http://www.omdbapi.com/?s=${movie}&apikey=30f52383`, (err, res, body) => {
    if (err) return console.log("Error!");

    const { Search } = JSON.parse(body);
    const searchList = Search.slice(0, 6);
    return searchList;
  })
}

// Creates individual search result
const createMovieElement = (movieInfo) => {
  let $movie = $(`
    <article>
      <div class="movieInfo">
        <p>${movieInfo.Title}</p>
        <p>(${movieInfo.Year})</p>
      </div>
      <div class="nominateBtn">
        <button type="submit" id="nominateMovie">Nominate</button>
      </div>
    </article>
  `);

  return $movie;
}

// Render top 6 results to results box
const renderMovies = (data) => {
  for (let movie of data) {
    let output = createMovieElement(movie);
    $(`#results`).append(output);
  }
}