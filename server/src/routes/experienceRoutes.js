import express from "express";
import {
    createExperience,
    getExperiences,
    getExperienceById,
    updateExperience,
    deleteExperience,
} from "../controllers/experienceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getExperiences).post(protect, createExperience);
router
    .route("/:id")
    .get(getExperienceById)
    .put(protect, updateExperience)
    .delete(protect, deleteExperience);

export default router;