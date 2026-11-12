import Company from "../models/Company.js";

// POST /api/companies (admin)
export const createCompany = async (req, res, next) => {
    try {
        const { name, logo, type } = req.body;
        if(!name){
            res.status(400);
            throw new Error("Comany name is required");
        }
        const company = await Company.create({
            name,
            logo,
            type
        });
        res.status(201).json(company);
    } catch (err) {
        next(err);
    }
};

// GET /api/companies (public)
export const getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find().sort({ name: 1 });
        res.json(companies);
    } catch (err) {
        next(err);
    }
};

// GET /api/companies/:slug (public)
export const getCompanyBySlug = async (req, res, next) => {
    try {
        const company = await Company.findOne({ slug: req.param.slug });
        if(!company) {
            res.status(404);
            throw new Error("Company not found");
        } 
        res.json(company);
    } catch (err) {
        next(err);
    }
};