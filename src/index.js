import Notiflix from 'notiflix';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searcheBtn = document.querySelector('#search-form button[type="submit"]');

const API_KEY = '34999731-d9d9d63f5d273555db0073a56';
let searchQuery = '';
let page = 1;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value;
  
  page = 1;

  clearGallery()

  fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
    .then(response => response.json())
    .then(photo => {
      page += 1;
      renderGallery(photo.hits);
      console.log(photo.totalHits)
      if (photo.hits.length === 0) {
        onFetchError();
      }
    })
    .catch(onFetchError);
};

function onFetchError(error) {
  Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
};

function onLoadMore() {
  fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
  .then(response => response.json())
    .then(photo => {
      page += 1;
      renderGallery(photo.hits);
      console.log(photo.totalHits);
    })
}

function renderGallery(photo) {
  const markup = photo.map(({ webformatURL, largeImageURL, tags,
    likes, views, comments, downloads}) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=440 />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}      
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    }).join("");
  gallery.insertAdjacentHTML('beforeend', markup)
}

function clearGallery() {
  gallery.innerHTML = "";
}


// searcheBtn.disabled = true;

// searchForm.searchQuery.addEventListener('focus', () => {
//     searcheBtn.disabled = false;
//   });

// if (document.activeElement === searchForm.searchQuery) {
//     searcheBtn.disabled = false;
//   }