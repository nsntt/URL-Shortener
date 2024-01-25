import { URLSchema, UserSchema } from "../schemas/models";
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class UrlController {
    static async getUrl (req, res) {
        const { personalizedLink } = req.params;
        const findUrl = await URLSchema.findOne({ personalized_link: personalizedLink }).select('-deleted');
        res.json({ findUrl })
    }

    static async deleteUrl (req, res) {
        const { urlId } = req.params;
        const findUrl = await URLSchema.findOneAndUpdate({ _id: urlId }, { deleted: true }, { new: true });

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
        const { toUrl, personalizedLink } = req.body;
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const user = jwt.verify(token, process.env.SECRET_PH);
        const getUser = await UserSchema.findOne({ _id: user.id });
        const newUrl = new URLSchema({
            to: toUrl,
            personalized_link: personalizedLink,
            created_by: user.id
        });
        await newUrl.save();

        getUser.urls.push(newUrl._id);
        await getUser.save();
        
        res.status(201).json({ status: 201, message: "Created!" });
    }
}