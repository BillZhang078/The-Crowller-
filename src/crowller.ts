import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import cheerio from 'cheerio';

interface Movie {
  title: string;
  rating?: number;
}

interface MovieInfo {
  time: Date;
  data: Movie[];
}

interface Content {
  [propsName: number]: Movie[];
}

class Crowller {
  private url: string = 'https://www.imdb.com/chart/top/';

  movieInfo: Movie[] = [];
  movieCollection: MovieInfo[] = [];

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
    const movieResult: MovieInfo = { time: new Date(), data: this.movieInfo };

    this.generateJsonContent(movieResult);
  }

  async getHtml() {
    const results = await superagent(this.url);
    this.getMovieInfo(results.text);
  }

  generateJsonContent(info: MovieInfo) {
    const filePath = path.resolve(__dirname, '../data/movie.json');
    let content: Content = {};
    if (fs.existsSync(filePath)) {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const date = Number(info.time);
    content[date] = info.data;
    fs.writeFileSync(filePath, JSON.stringify(content));
  }

  constructor() {
    this.getHtml();
  }
}

const Test = new Crowller();
