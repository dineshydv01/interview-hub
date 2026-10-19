import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    
    try {
        console.log("AUTH HEADER:", JSON.stringify(req.headers.authorization));
        const header = req.headers.authorization;

        if(!header || !header.startsWith("Bearer ")){
            res.status(401);
            throw new Error("Not authorized, no token");
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);
        if(!req.user){
            res.status(401);
            throw new Error("User no longer exists");
        }

        next();
    } catch (err) {
        if(res.statusCode === 200) res.status(401);
        next(err);
    }
};


export const authorize = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        res.status(403);
        return next(new Error("Forbidden: insufficient permissions"));
    }
    next();
};