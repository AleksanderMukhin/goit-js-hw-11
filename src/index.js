import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import debounce from 'lodash.debounce';
const axios = require('axios').default;


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searcheBtn = document.querySelector('#search-form button[type="submit"]');


const API_KEY = '34999731-d9d9d63f5d273555db0073a56';
let searchQuery = '';
let page = 1;

loadMoreBtn.classList.add('hidden');

searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.searchQuery.value;
  
  page = 1;

  clearGallery()

  axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=data&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
    .then(response => {
      const axoisData = response.data;
      return axoisData;
    })
    .then(data => {
      page += 1;
      const { totalHits, hits } = data;
      

      renderGallery(hits);
      console.log(hits)
      if (hits.length === 0) {
        onFetchError();
      } else if (totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        loadMoreBtn.classList.remove('hidden');
      }
    })
    .catch(error => {
      console.log(error.message);
      Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    });
};

function onFetchError(error) {
  Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
};


// window.addEventListener('scroll', () => {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   if (documentRect.bottom < document.documentElement.clientHeight + 150) {
//     onLoadMore()
//   }
      
// })




function renderGallery(data) {
  const markup = data.map(({ webformatURL, largeImageURL, tags,
    likes, views, comments, downloads}) => {
    return `<div class="data-card">
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <br>${likes}      
    </p>
    <p class="info-item">
      <b>Views</b>
      <br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      <br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <br>${downloads}
    </p>
  </div>
</div>`
    }).join("");
  gallery.insertAdjacentHTML('beforeend', markup)

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}


function clearGallery() {
  gallery.innerHTML = "";
}


const options = {
  rootMargin: '0px',
  threshold: 0.5
};

const observer = new IntersectionObserver(onLoadMore, options);

observer.observe(loadMoreBtn);
const lastCard = document.querySelectorAll('.gallery.data-card:last-of-type')
console.log("🚀  lastCard", lastCard)

function onLoadMore(entries) {
  if (entries[0].isIntersecting) {
    page += 1;

    axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=data&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
      .then(response => {
        const axoisData = response.data;
        return axoisData;
      })
      .then(data => {
        const { hits } = data;

        renderGallery(hits);
        console.log(hits)
      })
      .catch(error => {
        console.log(error.message);
        Notiflix.Notify.failure(`Sorry, there was an error while loading more images.`);
      });
  }
}


// function onLoadMore() {
//    axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=data&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
//     .then(response => {
//       const axoisData = response.data;
//       return axoisData;
//     })
//     .then(data => {
//       page += 1;
//       const { totalHits, hits } = data;
      

//       renderGallery(hits);
//       console.log(hits)
//       if (hits.length === 0) {
//         onFetchError();
//       } else if (totalHits > 0) {
//         Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
//         loadMoreBtn.classList.remove('hidden');
//       }
//     })
//    .finally(() => {
//       const { height: cardHeight } = document
//         .querySelector(".gallery")
//         .firstElementChild.getBoundingClientRect();
//       window.scrollBy({
//         top: cardHeight * 2,
//         behavior: "smooth",
//       });
//     });
//   };



// window.addEventListener('scroll', debounce(loadMore, 500));


// searcheBtn.disabled = true;

// searchForm.searchQuery.addEventListener('focus', () => {
//     searcheBtn.disabled = false;
//   });

// if (document.activeElement === searchForm.searchQuery) {
//     searcheBtn.disabled = false;
//   }