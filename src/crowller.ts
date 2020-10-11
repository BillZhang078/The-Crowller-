import path from 'path';
import fs from 'fs';
import superagent from 'superagent';
import DataAnalyzer from './dataAnalyzer';

class Crowller {
  private url: string = 'https://www.imdb.com/chart/top/';
  private filePath = path.resolve(__dirname, '../data/movie.json');

  private async getHtml() {
    const results = await superagent(this.url);
    return results.text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpider() {
    const results = await this.getHtml();
    const data = this.dataAnalyzer.analyseData(this.filePath, results);

    this.writeFile(data);
  }

  constructor(private dataAnalyzer: any) {
    this.initSpider();
  }
}

const dataAnalyzer = DataAnalyzer.createInstance();
const crowller = new Crowller(dataAnalyzer);
