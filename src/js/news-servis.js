const axios = require('axios').default;

export default class NewsApiService {
  constructor() {
    this.BASE_URL = 'https://pixabay.com/api/';
    this.API_KEY = '34999731-d9d9d63f5d273555db0073a56';
    this.searchQuery = '';
    this.page = 1;
  }  

   async fetchCard() {
    try {
      const response = await axios.get(`${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&image_type=data&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`);
      const data = response.data;
      
      this.page += 1;
      return data;
    } catch (error) {
      console.log(error.message);
      Notiflix.Notify.failure(`Sorry, there was an error while loading more images.`);
    }
  }   

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}