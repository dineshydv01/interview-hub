import express from "express";
import {
    createCompany,
    getCompanies,
    getCompanyBySlug,
} from "../controllers/companyController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getCompanies).post(protect, authorize("admin"), createCompany);
router.get("/:slug", getCompanyBySlug);

export default router;