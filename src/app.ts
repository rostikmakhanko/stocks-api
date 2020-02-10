import express, { Request, Response, json, NextFunction } from 'express';
import CompanyService from './services/companies';
import { ValidationError } from "yup";
import {apiCompanies} from './api/companies';

const app = express();
const fetch = require('node-fetch');
const LRU = require('lru-cache');
const path = require('path');
const cacheOptions = {
  max: 555,
  maxAge: 1000 * 60 * 10 //10 minutes
};
export const cache = new LRU(cacheOptions);

app.use(json());

export const apikey = "NZN11EYLZ0OL0C3E"

export const companies = new CompanyService();

app.use(express.static(path.join(__dirname,"../src/static")));

app.post("/api/v1/companies", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await companies.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

// app.get("/api/v1/companies", (req: Request, res: Response, next: NextFunction) => {
//   res.status(200).json({a: 1, b: 2})
// });

app.get("/api/v1/companies", apiCompanies);

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
