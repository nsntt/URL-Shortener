import { URLSchema, UserSchema } from "../schemas/models";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import mongoose from "mongoose";
config();

export class AuthMiddlewares {
    static async isLoggedIn(req, res, next) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        if(!token || token === null || token === undefined) return res.status(401).json({ status: 401, message: 'Unauthorized!' });
        try {
            const verified = jwt.verify(token, process.env.SECRET_PH);
            if(!verified) return res.status(401).json({ status: 401, message: 'Unauthorized!' });
            const user = await UserSchema.findOne({ _id: verified.id });
            if(!user) return res.status(401).json({ status: 401, message: 'Unauthorized!' });
            next();
        } catch (e) {
            return res.status(401).json({ status: 401, message: 'Unauthorized!' });
        }   
    }

    static async alreadyLoggedIn(req, res, next) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        if(token) {
            try {
                const verified = jwt.verify(token, process.env.SECRET_PH);
                if(!verified) next();
                return res.status(403).json({ status: 403, message: "Get out of here!" });
            } catch (e) {
                return res.status(403).json({ status: 403, message: "Get out of here!" });
            }
        } else {
            next();
        }
    }

    static async userExist(req, res, next) {
        const { userId } = req.params;
        const user = await UserSchema.findOne({ _id: userId });
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(409).json({ status: 409, message: "Invalid user id!" });
        if(!user) return res.status(404).json({ status: 404, message: "Invalid user!" });

        next();
    }

    static async isBanned(req, res, next) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        if(!token) return next();
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const user = await UserSchema.findOne({ _id: verified.id });
        if(user.banned) return res.status(403).json({ status: 403, message: 'Get out of here!' });

        next();
    }

    static async doubleUser(req, res, next) {
        const { email, username } = req.body;
        const userForEmail = await UserSchema.findOne({ email: email });
        if(userForEmail) return res.status(403).json({ status: 403, message: 'Get out of here!' });
        const userForUsername = await UserSchema.findOne({ username: username }); 
        if(userForUsername) return res.status(403).json({ status: 403, message: 'Get out of here!' });

        next();
    }

    static async checkRegister(req, res, next) {
        const { username, nick, email, password } = req.body;
        const validateEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!username || username === undefined || username === null) return res.status(409).json({ status: 409, message: "Provide valid username!" });
        if(!nick || nick === undefined || nick === null) return res.status(409).json({ status: 409, message: "Provide valid nickname!" });
        if(!email || email === undefined || email === null) return res.status(409).json({ status: 409, message: "Provide valid email!" });
        if(!password || password === undefined || password === null) return res.status(409).json({ status: 409, message: "Provide valid password!" });
        if(!validateEmail.test(email)) return res.status(409).json({ status: 409, message: "Provide valid email!" });
        if(password.length < 5) return res.status(411).json({ status: 411, message: "Provide large password!" });
        if(username.length < 2) return res.status(411).json({ status: 411, message: "Provide large username!" });
        if(username.length > 16) return res.status(411).json({ status: 411, message: "Provide shorter username!" });
        next();
    }

    static async checkLogin(req, res, next) {
        const { email, password } = req.body;
        const validateEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!email || email === undefined || email === null) return res.status(409).json({ status: 409, message: "Provide valid email!" });
        if(!password || password === undefined || password === null) return res.status(409).json({ status: 409, message: "Provide valid password!" });
        if(!validateEmail.test(email)) return res.status(409).json({ status: 409, message: "Provide valid email!" });
        if(password.length <= 5) return res.status(411).json({ status: 411, message: "Provide large password!" });
        next();
    }
}