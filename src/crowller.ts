import superagent from 'superagent';

interface Movie {
  name: string;
  rating: number;
}

class Crowller {
  private url: string = 'https://www.imdb.com/chart/top';
  private rawHtml = '';

  async getHtml() {
    const results = await superagent(this.url);
    this.rawHtml = results.text;
  }

  constructor() {
    this.getHtml();
  }
}

const Test = new Crowller();
