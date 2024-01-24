import { URLSchema, UserSchema } from "../schemas/models";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class UrlController {
    static async getUrl (req, res) {
        const { urlId } = req.params;
        const findUrl = await URLSchema.findOne({ _id: urlId }).populate('user');
        res.json({ findUrl })
    }

    static async deleteUrl (req, res) {
        const { urlId } = req.params;
        const findUrl = await URLSchema.findOneAndDelete({ _id: urlId });

        res.status(200).json({ status: 200, message: 'Deleted!' });
    }

    static async editUrl (req, res) {
        const { urlId } = req.params;
        const { toUrl } = req.body;

        const findUrl = await URLSchema.findOneAndUpdate(
            { _id: urlId },
            {
                to: toUrl
            },
            {
                new: true
            }
        );

        res.status(200).json({ status: 200, message: 'Updated!' });
    }

    static async createUrl (req, res) {
        const { toUrl } = req.body;
        const token = req.headers['Authorization'];
        const user = jwt.verify(token, process.env.SECRET_PH);

        const newUrl = new URLSchema({
            to: toUrl,
            created_by: user.id
        });

        await newUrl.save();

        res.status(201).json({ status: 201, message: "Created!" });
    }
}