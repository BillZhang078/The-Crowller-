import superagent from 'superagent';

class Crowller {
  private href: string = 'https://www.imdb.com/chart/top';

  async getHtml() {
    const results = await superagent(this.href);
  }

  constructor() {
    console.log('True');
  }
}

const Test = new Crowller();

Test.getHtml();
