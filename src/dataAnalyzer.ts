import cheerio from 'cheerio';
import fs from 'fs';

export interface Movie {
  title: string;
  rating?: number;
}

export interface MovieInfo {
  time: Date;
  data: Movie[];
}

export interface Content {
  [propsName: number]: Movie[];
}

export default class DataAnalyzer {
  private static instance: DataAnalyzer;

  public static createInstance() {
    if (!DataAnalyzer.instance) {
      DataAnalyzer.instance = new DataAnalyzer();
    }
    return DataAnalyzer.instance;
  }
  movieCollection: MovieInfo[] = [];

  private getMovieInfo(html: string) {
    const $ = cheerio.load(html);
    const MovieTitle = $('.titleColumn');
    let movieInfo: Movie[] = [];
    MovieTitle.map((index, item) => {
      if (index < 20) {
        const title = $(item)
          .find('a')
          .text();
        movieInfo.push({ title });
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
        movieInfo = movieInfo.map((item, index) => {
          if (index === order) {
            return { rating, ...item };
          } else {
            return item;
          }
        });
      }
    });

    return {
      time: new Date(),
      data: movieInfo
    };
  }

  private generateJsonContent(filePath: string, info: MovieInfo) {
    let content: Content = {};
    if (fs.existsSync(filePath)) {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const date = Number(info.time);
    content[date] = info.data;
    return JSON.stringify(content);
  }

  analyseData(filePath: string, results: string) {
    const info = this.getMovieInfo(results);
    const data = this.generateJsonContent(filePath, info);

    return data;
  }

  private constructor() {}
}
