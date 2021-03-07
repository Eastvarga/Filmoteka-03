import './sass/main.scss';
import './js/openLibrary.js';
import refs from './js/refs.js';
import homeTrending from './js/apiPopularFetch.js';
import apiService from './js/apiSearchFetch.js';
import gridTemplate from './templates/movie-grid.hbs';
import lightbox from './js/modalFilmMarkup';
import { processingSpinner, deleteSpinner } from './js/spinner-loader';

processingSpinner();
function genresFilter(data, genreIds) {
  const filtredData = data.filter(genre =>
    genreIds.find(genreId => genre.id === genreId),
  );
  return setGenresString(filtredData);
}
function setGenresString(genresArray) {
  const reqGenres = [];
  genresArray.map(res => reqGenres.push(` ${res.name}`));
  reqGenres.toString().trim();
  return reqGenres;
}
homeTrending.fetchGenres().then(genresData => {
  homeTrending.fetchPopular().then(results => {
    const newResults = results.map(result => {
      result.release_date = result.release_date.slice(0, 4);
      result.poster_path =
        'https://image.tmdb.org/t/p/original/' + result.poster_path;
      result.genre_ids = genresFilter(genresData, result.genre_ids);
      return result;
    });
    deleteSpinner();
    refs.movieGrid.insertAdjacentHTML('beforeend', gridTemplate(newResults));
    lightbox();
  });
});


///поиск по инпуту 
refs.inputForm.addEventListener('submit', event =>{
    event.preventDefault();
    const form = event.currentTarget;
    apiService.query = form.elements.query.value;

refs.movieGrid.innerHTML = " ";
form.reset(); //чистим форму 

homeTrending.fetchGenres().then(genresData => {
apiService.fetchMovie().then(results => {
    if(results.length === 0){
        refs.errorWarning.classList.remove("is-hidden")
        return;
    } else{
        refs.errorWarning.classList.add("is-hidden");
    }
    const newResults = getNewResult(results, genresData);
    refs.movieGrid.insertAdjacentHTML('beforeend', gridTemplate(newResults));
  });
});

});

function getNewResult(results, genresData) {
    results.map(result => {
        result.release_date = result.release_date.slice(0, 4);
        result.poster_path =
          'https://image.tmdb.org/t/p/original/' + result.poster_path;
          result.genre_ids = genresFilter(genresData, result.genre_ids);
        return result;
      });
    return results;
}