"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4_1 = require("uuidv4");
const yup = __importStar(require("yup"));
const companySchema = yup.object().shape({
    id: yup.string().required(),
    symbol: yup.string().required(),
    name: yup.string().required()
});
class CompanyService {
    constructor() {
        this.store = new Map();
    }
    async create(params) {
        const { symbol, name } = params;
        const id = uuidv4_1.uuid();
        const company = {
            id,
            symbol,
            name,
        };
        await companySchema.validate(company, { strict: true });
        this.store.set(id, company);
        return company;
    }
    async get(id) {
        return this.store.get(id);
    }
    async getList() {
        const companies = Array.from(this.store.values());
        return {
            companies: companies,
            total: companies.length,
        };
    }
    update() {
    }
    async delete(id) {
        this.store.delete(id);
    }
}
exports.default = CompanyService;
