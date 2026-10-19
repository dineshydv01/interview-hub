import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sendAuthResponse = (res, user, status = 200) => {
    res.status(status).json({
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            branch: user.branch,
            graduationYear: user.graduationYear,
        },
    });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
    try{
        const { name, email, password, branch, graduationYear } = req.body;

        if(!name || !email || !password) {
            res.status(400);
            throw new Error("Name, email and password are required");
        }

        const exists = await User.findOne({ email });
        if(exists) {
            res.status(400);
            throw new Error("Email already registered");
        }

        const user = await User.create({ name, email, password, branch, graduationYear });
        sendAuthResponse(res, user, 201);
    
    } catch(err){
        next(err);
    }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if(!user || !( await user.matchPassword(password))) {
            res.status(401);
            throw new Error("Invalid email or password");
        }

        sendAuthResponse(res, user);

    } catch(err) {
        next(err);
    }
};

export const getMe = (req, res) => {
    res.json({ user: req.user });
};