import path from 'path';
import fs from 'fs';
import superagent from 'superagent';
import DataAnalyzer from './dataAnalyzer';

class Crowller {
  private url: string = 'https://www.imdb.com/chart/top/';
  private filePath = path.resolve(__dirname, '../data/movie.json');

  async getHtml() {
    const results = await superagent(this.url);
    return results.text;
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  async initSpider() {
    const results = await this.getHtml();
    const data = this.dataAnalyzer.analyseData(this.filePath, results);
    console.log(data);
    this.writeFile(data);
  }

  constructor(private dataAnalyzer: any) {
    this.initSpider();
  }
}

const dataAnalyzer = new DataAnalyzer();
const crowller = new Crowller(dataAnalyzer);
