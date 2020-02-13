import { uuid } from 'uuidv4';
import * as yup from 'yup'

type CompanyCreateParams = {
    symbol: string;
    name: string;
}

type Company = {
    id: string;
    symbol: string;
    name: string;
}

type CompanyPagination = {
    companies: Company[];
    total: number;
}

const companySchema = yup.object().shape({
    id: yup.string().required(),
    symbol: yup.string().required(),
    name: yup.string().required()
});

export default class CompanyService {
    private store: Map<string, Company>;

    constructor() {
        this.store = new Map();
    }

    async create(params: CompanyCreateParams): Promise<Company> {
        const { symbol, name } = params;
        const id = uuid();

        const company: Company = {
            id,
            symbol,
            name,
        };

        await companySchema.validate(company, { strict: true });

        this.store.set(id, company);

        return company;
    }

    async get(id: string) {
        return this.store.get(id);
    }

    async getList(): Promise<CompanyPagination> {
        const companies = Array.from(this.store.values());

        return {
            companies: companies,
            total: companies.length,
        };
    }

    update() {

    }

    async delete(id: string): Promise<void> {
        this.store.delete(id);
    }
}
