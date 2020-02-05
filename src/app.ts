import express, { Request, Response, json, NextFunction } from 'express';
import CompanyService from './services/companies';
import { ValidationError } from "yup";

const app = express();
const fetch = require('node-fetch');
app.use(json());

const apikey = "NZN11EYLZ0OL0C3E"

const companies = new CompanyService();

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to stock-api!");
});

app.post("/api/v1/companies", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await companies.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

function getStockPriceByCompanySymbol(symbol: string){
  try {
    const url = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=" + symbol + "&interval=5min&apikey=" + apikey;
    //console.log(1);
    return fetch(url, { method: 'GET' })
      .then((res: any) => {return res.json();})
      .then((json: any) => {
        //console.log(11);
        const price: number = json["Time Series (5min)"][Object.keys(json["Time Series (5min)"])[0]]["4. close"];
        console.log(price);
        return price;
      })
  } catch (err) {
    throw ("Cannot get stock price by company symbol");
  }
}

app.get("/api/v1/companies", async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.companyName) {
    try {
        const result = await companies.getList();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
    return;
  }
    try {
        const url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="
                    + req.query.companyName + "&apikey=" + apikey;//what the hell is going on?
        console.log(url);
        await fetch(url, { method: 'GET' } )
          .then((res: any) => {return res.json();})
          .then((json: any) => {
            if (Object.keys(json.bestMatches).length === 0) {
              res.status(404).json({ message: 'Company not found' });
            }
            const bestMatchSymbol = json.bestMatches[0]['1. symbol'];
            getStockPriceByCompanySymbol(bestMatchSymbol)
              .then((price: number) => {
                res.status(200).json(price);
              })
            //res.status(200).json(getStockPriceByCompanySymbol(bestMatchSymbol));
          });
    } catch (err) {
        next(err);
    }
});

app.get("/api/v1/companies/:companyId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await companies.get(req.params.companyId);

        if (!result) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

app.delete("/api/v1/company/:companyId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await companies.delete(req.params.companyId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

//For what do we need use
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
        res.status(422);
    } else {
        res.status(500);
    }

    res.json({ message: err.message });
});

export default app;
