import { Request, Response, json, NextFunction } from 'express';
import { ValidationError } from "yup";
import {cache, apikey, companies} from "../../app";

const fetch = require('node-fetch');

function getStockPriceByCompanySymbol(symbol: string){
  try {
    // limit=10
    const url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apikey;
    //console.log(1);
    return fetch(url, { method: 'GET' })
      .then((res: any) => {return res.json();})
      .then((json: any) => {
        console.log(json);
        if (json.Note) {
          return null;
        }
        const price: any = json["Global Quote"]["05. price"];
        console.log(price);
        return price;
      })
  } catch (err) {
    throw ("Cannot get stock price by company symbol");
  }
}

export const apiCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.companyName) {
      const result = await companies.getList();
      return res.status(200).json(result);
    }

    if (cache.get(req.query.companyName)) {
      return res.status(200).json(cache.get(req.query.companyName));
    }

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
            if (price === null) {
              console.log("Queries limit exceeded");
              res.status(403).json({message: "Queries limit exceeded"});
            }
            cache.set(req.query.companyName, price);
            res.status(200).json(price);
          });

      //res.status(200).json(getStockPriceByCompanySymbol(bestMatchSymbol));
    });
  } catch (err) {
    next(err);
  }
};
