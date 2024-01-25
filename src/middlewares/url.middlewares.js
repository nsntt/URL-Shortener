import { URLSchema, UserSchema } from "../schemas/models";
import { validarURL } from "../lib/utils";  
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();

export class UrlMiddlewares {
    static async urlExist(req, res, next) {
        const { personalizedLink } = req.params;
        const findUri = await URLSchema.findOne({ personalized_link: personalizedLink });
        if(!findUri) return res.status(404).json({ status: 404, message: "Invalid Url!" });

        next()
    }

    static async isValidUrl(req, res, next) {
        const { toUrl, personalizedLink } = req.body;
        const regexURL = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/;
        if (!regexURL.test(toUrl)) return res.status(409).json({ status: 409, message: "Invalid Url!" });
        if(!personalizedLink || personalizedLink === undefined || personalizedLink === null) return res.status(409).json({ status: 409, message: "Invalid Personalized Name!" });
        if(personalizedLink.length < 2) return res.status(409).json({ status: 409, message: "Invalid Personalized Name, too short!" });
        if(personalizedLink.length > 32) return res.status(409).json({ status: 409, message: "Invalid Personalized Name, too long!" });
        const getUrlByName = await URLSchema.findOne({ personalized_link: personalizedLink });
        if(getUrlByName) return res.status(409).json({ status: 409, message: "Already used Personalized Name!" });
        
        const isUrl = validarURL(toUrl);
        if(!isUrl) return res.status(409).json({ status: 409, message: "Invalid Url!" });
        next();
    }

    static async limitedUrl(req, res, next) {
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const findUrls = await URLSchema.find({ created_by: verified.id });
        if(findUrls.length >= 5) return res.status(423).json({ status: 423, message: "You have exceeded your url shortener limit. To get more pay, poor." });
        next()
    }

    static async isMyUrl(req, res, next) {
        const { personalizedLink } = req.params;
        const token = req.headers['authorization'] || req.headers['Authorization'];
        const verified = jwt.verify(token, process.env.SECRET_PH);
        const findUri = await URLSchema.findOne({ personalized_link: personalizedLink });
        if(findUri.created_by.toString() !== verified.id) return res.status(403).json({ status: 403, message: "Get out of here!" });
        next();
    }

    static async isDeleted(req, res, next) {
        const { personalizedLink } = req.params;
        const findUri = await URLSchema.findOne({ personalized_link: personalizedLink });
        if(findUri.deleted) return res.status(404).json({ status: 404, message: "Invalid Url!" });
        
        next();
    }
}