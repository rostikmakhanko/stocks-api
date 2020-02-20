export const getCompanies= async (name: string) => {
    const res = await fetch(`http://127.0.0.1:3000/api/v1/companies?companyName=${name}`);
    const data = await res.json();

    return data;
}