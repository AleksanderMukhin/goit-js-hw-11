import Notiflix from 'notiflix';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

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
      } else if (photo.totalHits > 0) {
       Notiflix.Notify.success(`Hooray! We found ${photo.totalHits} images.`);
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
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
  </a>
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

  const lightbox = new SimpleLightbox('.gallery a');
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