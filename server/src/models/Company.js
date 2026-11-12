import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        },
        logo: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ["product", "service", "startup"],
            default: "product"
        },
    },
    { timestamps: true }
);

companySchema.pre("validate", function () {
    if (this.isModified("name") && this.name) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^(-|-)$/g, "");
    }
});

export default mongoose.model("Company", companySchema);