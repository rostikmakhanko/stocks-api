"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const companies_1 = __importDefault(require("./services/companies"));
const yup_1 = require("yup");
const app = express_1.default();
const fetch = require('node-fetch');
const LRU = require('lru-cache');
const cacheOptions = {
    max: 555,
    maxAge: 10 * 60 * 10
};
const cache = new LRU(cacheOptions);
app.use(express_1.json());
const apikey = "NZN11EYLZ0OL0C3E";
const companies = new companies_1.default();
app.get("/", (req, res) => {
    res.send("Welcome to stock-api!");
});
app.post("/api/v1/companies", async (req, res, next) => {
    try {
        const result = await companies.create(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
});
function getStockPriceByCompanySymbol(symbol) {
    try {
        const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=5min&apikey=" + apikey;
        //console.log(1);
        return fetch(url, { method: 'GET' })
            .then((res) => { return res.json(); })
            .then((json) => {
            //console.log(11);
            const price = json["Time Series (5min)"][Object.keys(json["Time Series (5min)"])[0]]["4. close"];
            console.log(price);
            return price;
        });
    }
    catch (err) {
        throw ("Cannot get stock price by company symbol");
    }
}
app.get("/api/v1/companies", async (req, res, next) => {
    if (!req.query.companyName) {
        try {
            const result = await companies.getList();
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
        return;
    }
    try {
        if (cache.get(req.query.companyName)) {
            res.status(200).json(cache.get(req.query.companyName));
        }
        else {
            const url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="
                + req.query.companyName + "&apikey=" + apikey;
            console.log(url);
            await fetch(url, { method: 'GET' })
                .then((res) => { return res.json(); })
                .then((json) => {
                if (Object.keys(json.bestMatches).length === 0) {
                    res.status(404).json({ message: 'Company not found' });
                }
                const bestMatchSymbol = json.bestMatches[0]['1. symbol'];
                getStockPriceByCompanySymbol(bestMatchSymbol)
                    .then((price) => {
                    cache.set(req.query.companyName, price);
                    res.status(200).json(price);
                });
                //res.status(200).json(getStockPriceByCompanySymbol(bestMatchSymbol));
            });
        }
    }
    catch (err) {
        next(err);
    }
});
app.get("/api/v1/companies/:companyId", async (req, res, next) => {
    try {
        const result = await companies.get(req.params.companyId);
        if (!result) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
app.delete("/api/v1/company/:companyId", async (req, res, next) => {
    try {
        await companies.delete(req.params.companyId);
        res.status(204).end();
    }
    catch (err) {
        next(err);
    }
});
//For what do we need use
app.use((err, req, res, next) => {
    if (err instanceof yup_1.ValidationError) {
        res.status(422);
    }
    else {
        res.status(500);
    }
    res.json({ message: err.message });
});
exports.default = app;
