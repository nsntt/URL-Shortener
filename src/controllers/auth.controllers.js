import { URLSchema, UserSchema } from "../schemas/models";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt'
import { config } from "dotenv";
config();

export class AuthController {
    static async getMe(req, res) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const user = await UserSchema.findOne({ _id: verified.id }).select('-password -banned -deleted');
        res.status(200).json({ user });
    } 

    static async getUser(req, res) {
        const { userId } = req.params;
        const user = await UserSchema.findOne({ _id: userId }).select('-email -password');
        res.status(200).json({ user });
    }

    static async updateMyNick(req, res) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const { nick } = req.body;
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const user = await UserSchema.findOneAndUpdate({ _id: verified.id }, { nick: nick }, { new: true });
        res.status(200).json({ user });
    }

    static async deleteMe(req, res) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const user = await UserSchema.findOneAndDelete({ _id: verified.id });
        res.status(204)
    }

    static async createMe(req, res) {
        const { username, nick, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newpassword = hash;
        const user = new UserSchema({
            username: username,
            nick: nick,
            email: email,
            password: newpassword,
            date: new Date()
        });
        await user.save();
        const token = jwt.sign({
            id: user._id,
            username: username,
            email: email
        }, process.env.SECRET_PH);

        res.status(201).json({ status: 201, token: token });
    }

    static async logMe(req, res) {
        const { email, password } = req.body;
        const user = await UserSchema.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid credentials" });
        }
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
        }, process.env.SECRET_PH);
    
        res.status(200).json({ status: 200, token: token });
    }
}