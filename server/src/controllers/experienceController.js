import Experience from "../models/Experience.js";
import Company from "../models/Company.js";

// Only these fields may come from the client
const ALLOWED = [
    "company", "role", "year", "offerType", "result",
    "overallDifficulty", "rounds", "tips", "isAnonymous",
];

const pick = (obj, keys) =>
    Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

// Hide the author when the post is anonymous
const toPublic = (doc) => {
    const obj = doc.toObject();
    if (obj.isAnonymous) obj.author = null;
    return obj;
};

const populateOptions = [
    { path: "company", select: "name slug logo type" },
    { path: "author", select: "name branch graduationYear" },
];

// POST /api/experiences  (logged-in)
export const createExperience = async (req, res, next) => {
    try {
        const data = pick(req.body, ALLOWED);

        const company = await Company.findById(data.company);
        if (!company) {
            res.status(400);
            throw new Error("Company does not exist");
        }

        // author comes from the token, status is forced to "pending"
        const experience = await Experience.create({ ...data, author: req.user._id });
        res.status(201).json(experience);
    } catch (err) {
        next(err);
    }
};

// GET /api/experiences  (public, approved only)
export const getExperiences = async (req, res, next) => {
    try {
        const experiences = await Experience.find({ status: "approved" })
            .populate(populateOptions)
            .sort({ createdAt: -1 });

        res.json(experiences.map(toPublic));
    } catch (err) {
        next(err);
    }
};

// GET /api/experiences/:id  (public, approved only)
export const getExperienceById = async (req, res, next) => {
    try {
        const experience = await Experience.findOne({
            _id: req.params.id,
            status: "approved",
        }).populate(populateOptions);

        if (!experience) {
            res.status(404);
            throw new Error("Experience not found");
        }
        res.json(toPublic(experience));
    } catch (err) {
        next(err);
    }
};

// PUT /api/experiences/:id  (owner only)
export const updateExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            res.status(404);
            throw new Error("Experience not found");
        }

        if (!experience.author.equals(req.user._id)) {
            res.status(403);
            throw new Error("You can only edit your own experiences");
        }

        const data = pick(req.body, ALLOWED);

        if (data.company) {
            const company = await Company.findById(data.company);
            if (!company) {
                res.status(400);
                throw new Error("Company does not exist");
            }
        }

        experience.set(data);
        experience.status = "pending";      // edited posts need re-approval
        experience.rejectionReason = undefined;
        await experience.save();

        res.json(experience);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/experiences/:id  (owner or admin)
export const deleteExperience = async (req, res, next) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            res.status(404);
            throw new Error("Experience not found");
        }

        const isOwner = experience.author.equals(req.user._id);
        if (!isOwner && req.user.role !== "admin") {
            res.status(403);
            throw new Error("Not allowed to delete this experience");
        }

        await experience.deleteOne();
        res.json({ message: "Experience deleted" });
    } catch (err) {
        next(err);
    }
};