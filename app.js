const API_KEY = "ece985488c982715535011849742081f";
const imagePath = "https://image.tmdb.org/t/p/w1280";
const input = document.querySelector(".search input");
const btn = document.querySelector(".search button");
const mainGridTitle = document.querySelector(".favourites h1");
const mainGrid = document.querySelector(".favourites .movies-grid");
const trendingGrid = document.querySelector(".trending .movies-grid");
const popupContainer = document.querySelector(".popup-container");

async function getMovieBySearch(search_term) {
  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`
  );
  let respData = await resp.json();

  return respData.results;
}
async function addSearchMoviestoDOM() {
  const search_term = input.value;
  const data = await getMovieBySearch(search_term);
  mainGridTitle.innerText = "Search Results...";
  let resultArr = data.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
            <div class="img">
              <img src="${imagePath + m.poster_path}" alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
              </div>
            </div>
          </div>
    `;
  });
  mainGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}
btn.addEventListener("click", addSearchMoviestoDOM);
function addClickEffectToCards(cards) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      showPopUp(card);
    });
  });
}
async function getMovieById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
}
async function getMovieTrailerById(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results[0].key;
}


// Local Storage Management Functions
function saveToLocalStorage(movie) {
  let favorites = getFromLocalStorage();
  if (!isMovieInFavorites(movie.id)) {
    favorites.push(movie);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

function getFromLocalStorage() {
  return localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
}

function isMovieInFavorites(movieId) {
  let favorites = getFromLocalStorage();
  return favorites.some(movie => movie.id === movieId);
}

function removeFromLocalStorage(movieId) {
  let favorites = getFromLocalStorage();
  favorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}



async function showPopUp(card) {
  popupContainer.classList.add("show-popup");
  const movieId = parseInt(card.getAttribute("data-id"));
  const movie = await getMovieById(movieId);
  const key = await getMovieTrailerById(movieId);

  const isFavorite = isMovieInFavorites(movieId);

  popupContainer.style.background = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1)), url(${imagePath + movie.poster_path})`;
  popupContainer.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
      <div class="left">
        <div class="poster-img">
          <img src="${imagePath + movie.poster_path}" alt="" />
        </div>
        <div class="single-info">
          <span>Add to favourites :</span>
          <span class="heart-icon ${isFavorite ? 'change-color' :  ''}">&#9829;</span>
        </div>
      </div>
      <div class="right">
        <h1>${movie.title}</h1>
        <h3>${movie.tagline}</h3>
        <div class="single-info-container">
          <div class="single-info">
            <span>Languages :</span>
            <span>${movie.spoken_languages[0].name}</span>
          </div>
          <div class="single-info">
            <span>Length :</span>
            <span>${movie.runtime} Minutes</span>
          </div>
          <div class="single-info">
            <span>Rating :</span>
            <span>${movie.vote_average} / 10</span>
          </div>
          <div class="single-info">
            <span>Budget :</span>
            <span>$ ${movie.budget} </span>
          </div>
          <div class="single-info">
            <span>Release Date :</span>
            <span>${movie.release_date}</span>
          </div>
        </div>
        <div class="genres">
          <h2>Genres</h2>
          <ul>
            ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
          </ul>
        </div>
        <div class="overview">
          <h2>Overview</h2>
          <p>${movie.overview}</p>
        </div>
        <div class="trailer">
          <h2>Trailer</h2>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  `;

  const x_icon = document.querySelector(".x-icon");
  x_icon.addEventListener("click", () => {
    popupContainer.classList.remove("show-popup");
  });

  const heart_icon = document.querySelector(".heart-icon");
  heart_icon.addEventListener("click", () => {
    if (isFavorite) {
      heart_icon.classList.remove("change-color");
      removeFromLocalStorage(movieId);
    } else {
      heart_icon.classList.add("change-color");
      saveToLocalStorage(movie);
    }
    addFavoriteMoviesToDOM(); // Update the favorite movies section
  });
}



async function getTrendingMovies() {
  const resp = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
  );
  let respData = await resp.json();
  return respData.results;
}
async function addTrendingMoviestoDOM() {
  const data = await getTrendingMovies();
  const displayMovies = data.slice(0, 8);
  //console.log(displayMovies);
  let resultArr = displayMovies.map((m) => {
    return `
    <div class="card" data-id="${m.id}">
            <div class="img">
              <img src="${imagePath + m.poster_path}" alt="" />
            </div>
            <div class="info">
              <h2>${m.title}</h2>
              <div class="single-info">
                <span>Rating :</span>
                <span>${m.vote_average} / 10</span>
              </div>
              <div class="single-info">
                <span>Release Date :</span>
                <span>${m.release_date}</span>
              </div>
            </div>
          </div>
    `;
  });
  trendingGrid.innerHTML = resultArr.join(" ");
  const cards = document.querySelectorAll(".card");
  addClickEffectToCards(cards);
}


function addFavoriteMoviesToDOM() {
  const favoriteMovies = getFromLocalStorage();
  if (favoriteMovies.length > 0) {
    mainGridTitle.innerText = "My Favourite Movies";
    let resultArr = favoriteMovies.map((m) => {
      return `
      <div class="card" data-id="${m.id}">
        <div class="img">
          <img src="${imagePath + m.poster_path}" alt="" />
        </div>
        <div class="info">
          <h2>${m.title}</h2>
          <div class="single-info">
            <span>Rating :</span>
            <span>${m.vote_average} / 10</span>
          </div>
          <div class="single-info">
            <span>Release Date :</span>
            <span>${m.release_date}</span>
          </div>
        </div>
      </div>
      `;
    });
    mainGrid.innerHTML = resultArr.join(" ");
    const cards = document.querySelectorAll(".card");
    addClickEffectToCards(cards);
  } else {
    mainGridTitle.innerText = "No Favourite Movies Found";
    mainGrid.innerHTML = "";
  }
}

// show favorite movies 
addFavoriteMoviesToDOM();
// show tranding movies
addTrendingMoviestoDOM();
