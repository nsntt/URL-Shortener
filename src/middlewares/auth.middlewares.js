import { URLSchema, UserSchema } from "../schemas/models";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class AuthMiddlewares {
    static async isLoggedIn(req, res, next) {
        const token = req.headers['Authorization'];
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
}