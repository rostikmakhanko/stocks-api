'use strict';
import { Request, Response, json, NextFunction } from 'express';
import { ValidationError } from "yup";
import {cache, apikey, companies} from "../../app";

const fetch = require('node-fetch');

function getStockDataByCompanySymbol(symbol: string){
  try {
    // limit=10
    const url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + apikey;
    console.log(1);
    return fetch(url, { method: 'GET' })
      .then((res: any) => {return res.json();})
      .then((json: any) => {
        console.log(json);
        if (json.Note) {
          return null;
        }
        //const price: any = json["Global Quote"]["05. price"];
        //console.log(price);
        const resultJson = {
          symbol: json["Global Quote"]["01. symbol"],
          price: json["Global Quote"]["05. price"],
          change: json["Global Quote"]["09. change"],
          change_percent: json["Global Quote"]["10. change percent"]
        };
        console.log(resultJson);
        return resultJson;
      })
  } catch (err) {
    throw ("Cannot get stock price by company symbol");
  }
}

async function fullCompanyDataByCompanyName(companyName: string) {
  try {
    if (cache.get(companyName)) {
      return cache.get(companyName);
    }

    const url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="
                + companyName + "&apikey=" + apikey;
    console.log(url);

    return fetch(url, { method: 'GET' } )
      .then((res: any) => {return res.json();})
      .then((json: any) => {
        if (Object.keys(json.bestMatches).length === 0) {
          return { "message": 'Company not found' };
        }

        const bestMatchSymbol = json.bestMatches[0]["1. symbol"];
        const bestCompanyName = json.bestMatches[0]["2. name"];

        return getStockDataByCompanySymbol(bestMatchSymbol)
          .then((stockData: any) => {
            if (stockData === null) {
              return { "message": "Queries limit exceeded" };
            }
            stockData.name = bestCompanyName;
            cache.set(companyName, stockData);
            return stockData;
          });
      //res.status(200).json(getStockPriceByCompanySymbol(bestMatchSymbol));
    });
  } catch (err) {
    return { "message": err.message };
  }
}

export const apiCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.query.companyName) {
      const result = await companies.getList();
      return res.status(200).json(result);
    }

    let companiesList = req.query.companyName.split(',').map((el: string) => {return el.trim();});
    console.log(companiesList);
    const result = await Promise.all(companiesList.map((company: string) => {return fullCompanyDataByCompanyName(company);}));
    //await fullCompanyDataByCompanyName(req.query.companyName);
    res.status(200).json(result);
    } catch (err) {
    next(err);
  }
};
