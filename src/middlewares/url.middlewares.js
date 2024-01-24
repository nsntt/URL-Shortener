import { URLSchema, UserSchema } from "../schemas/models";
import { validarURL } from "../lib/utils";  
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class UrlMiddlewares {
    static async urlExist(req, res, next) {
        const { urlId } = req.params;
        const findUri = await URLSchema.findOne({ _id: urlId });
        if(!findUri) return res.status(404).json({ status: 404, message: "Invalid Url!" });
    }

    static async isValidUrl(req, res, next) {
        const { toUrl } = req.body;
        const regexURL = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/;
        if (!regexURL.test(toUrl)) return res.status(409).json({ status: 409, message: "Invalid Url!" });
        const isUrl = validarURL(toUrl);
        if(!isUrl) return res.status(409).json({ status: 409, message: "Invalid Url!" });
        next();
    }

    static async limitedUrl(req, res, next) {
        const token = req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const findUrls = await URLSchema.find({ created_by: verified.id });
        if(findUrls.length >= 5) return res.status(423).json({ status: 423, message: "You have exceeded your url shortener limit. To get more pay, poor." });
        next()
    }

    static async isMyUrl(req, res, next) {
        const { urlId } = req.params;
        const token = req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const findUri = await URLSchema.findOne({ _id: urlId });
        if(findUri.created_by !== verified.id) return res.status(403).json({ status: 403, message: "Get out of here!" });
        next();
    }
}