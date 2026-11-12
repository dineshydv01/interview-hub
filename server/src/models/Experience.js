import mongoose from "mongoose";
import Company from "./Company.js";

const roundSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["online-test", "technical", "hr", "group-discussion"],
            required: true
        },
        duration: Number,
        difficulty: {
            type: Number,
            min: 1,
            max: 5
        },
        description: {
            type: String,
            trim: true
        },
        questions: [{
            type: String,
            trim: true
        }]
    },
    { _id: false }
);


const experienceSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },
        role: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            required: true
        },
        offerType: {
            type: String,
            enum: ["intern", "fulltime"],
            required: true
        },
        result: {
            type: String,
            enum: ["selected", "rejected", "waiting"],
            required: true
        },
        overallDifficulty: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        rounds: {
            type: [roundSchema],
            validate: {
                validator: (v) => v.length > 0,
                message: "At least one round is required"
            },
        },
        tips: {
            type: String,
            trim: true
        },
        isAnonymous: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        rejectionReason: String,
        upvoteCount: {
            type: Number,
            default: 0
        },
        upvotedBy: {
            type: [{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User" 
            }],
            select: false
        },
    },
    { timestamps: true }
);

experienceSchema.index({ company: 1, status: 1, createdAt: -1 });

export default mongoose.model("Experience", experienceSchema);