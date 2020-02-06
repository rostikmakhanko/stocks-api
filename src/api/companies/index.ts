import { Request, Response, json, NextFunction } from 'express';
import { ValidationError } from "yup";
import {cache, apikey, companies} from "../../app";

const fetch = require('node-fetch');

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

export const apiCompanies = async (req: Request, res: Response, next: NextFunction) => {
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
    if (cache.get(req.query.companyName)) {
      res.status(200).json(cache.get(req.query.companyName));
    } else {
      const url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="
                  + req.query.companyName + "&apikey=" + apikey;
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
              cache.set(req.query.companyName, price);
              res.status(200).json(price);
            });

        //res.status(200).json(getStockPriceByCompanySymbol(bestMatchSymbol));
      });
    }
  } catch (err) {
    next(err);
  }
};
