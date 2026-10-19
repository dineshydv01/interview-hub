import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role: {
            type: String,
            enum: ["Student", "admin"],
            default: "Student"
        },
        branch: {
            type: String,
            trim: true
        },
        graduationYear: Number,
    },
    { timestamps: true}
);


userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model("User", userSchema);