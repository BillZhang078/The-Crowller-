import superagent from 'superagent';
import cheerio from 'cheerio';
interface Movie {
  title: string;
  rating?: number;
}

class Crowller {
  private url: string = 'https://www.imdb.com/chart/top/';

  movieInfo: Movie[] = [];

  getMovieInfo(html: string) {
    const $ = cheerio.load(html);
    const MovieTitle = $('.titleColumn');

    MovieTitle.map((index, item) => {
      if (index < 20) {
        const title = $(item)
          .find('a')
          .text();
        this.movieInfo.push({ title });
      }
    });
    const MovieRating = $('.imdbRating');
    MovieRating.map((index, item) => {
      if (index < 20) {
        const rating: number = parseFloat(
          $(item)
            .find('strong')
            .text()
        );
        const order = index;
        this.movieInfo = this.movieInfo.map((item, index) => {
          if (index === order) {
            return { rating, ...item };
          } else {
            return item;
          }
        });
      }
    });
    console.log(this.movieInfo);
  }

  async getHtml() {
    const results = await superagent(this.url);
    this.getMovieInfo(results.text);
  }

  constructor() {
    this.getHtml();
  }
}

const Test = new Crowller();
