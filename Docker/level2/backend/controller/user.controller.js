import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({ message: "All field is required!"})
        }

        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ message: "User is Already Exist"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Length of password is small"});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: passwordHash
        });

        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name }
        });

    } catch (error) {
        console.log(error.message);

        res.json({
                success: false,
                message: error.message,
        });
    }
} 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: "All field is required!"})
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User is not found"});
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return res.status(404).json({message: "Password is not match"});
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return res.json({
                success: true,
                user: { email: user.email, name: user.name }
        });
    } catch (error) {
        console.log(error.message);

        res.json({
                success: false,
                message: error.message,
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' :'strict'
        }
        );

        return res.json({message: "Logout SuccessFully"});
    } catch (error) {
        console.log(error.message);

        res.json({
                success: false,
                message: error.message,
        });
    }
}