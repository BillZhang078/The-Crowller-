"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var DataAnalyzer = /** @class */ (function () {
    function DataAnalyzer() {
        this.movieCollection = [];
    }
    DataAnalyzer.prototype.getMovieInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var MovieTitle = $('.titleColumn');
        var movieInfo = [];
        MovieTitle.map(function (index, item) {
            if (index < 20) {
                var title = $(item)
                    .find('a')
                    .text();
                movieInfo.push({ title: title });
            }
        });
        var MovieRating = $('.imdbRating');
        MovieRating.map(function (index, item) {
            if (index < 20) {
                var rating_1 = parseFloat($(item)
                    .find('strong')
                    .text());
                var order_1 = index;
                movieInfo = movieInfo.map(function (item, index) {
                    if (index === order_1) {
                        return __assign({ rating: rating_1 }, item);
                    }
                    else {
                        return item;
                    }
                });
            }
        });
        return {
            time: new Date(),
            data: movieInfo
        };
    };
    DataAnalyzer.prototype.generateJsonContent = function (filePath, info) {
        var content = {};
        if (fs_1.default.existsSync(filePath)) {
            content = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        var date = Number(info.time);
        content[date] = info.data;
        return JSON.stringify(content);
    };
    DataAnalyzer.prototype.analyseData = function (filePath, results) {
        var info = this.getMovieInfo(results);
        var data = this.generateJsonContent(filePath, info);
        return data;
    };
    return DataAnalyzer;
}());
exports.default = DataAnalyzer;
