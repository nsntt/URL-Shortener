import { UrlController } from "../controllers/url.controllers";
import { AuthMiddlewares } from "../middlewares/auth.middlewares";
import { UrlMiddlewares } from "../middlewares/url.middlewares";
import { Router } from "express";

const router = Router();

router.route('/url')
    .post([AuthMiddlewares.isLoggedIn, UrlMiddlewares.isValidUrl, UrlMiddlewares.limitedUrl], UrlController.createUrl)

router.route('/url/:urlId')
    .get([UrlMiddlewares.urlExist], UrlController.getUrl)
    .delete([AuthMiddlewares.isLoggedIn, UrlMiddlewares.urlExist, UrlMiddlewares.isMyUrl], UrlController.deleteUrl)
    .put([AuthMiddlewares.isLoggedIn, UrlMiddlewares.urlExist, UrlMiddlewares.isMyUrl, UrlMiddlewares.isValidUrl], UrlController.editUrl)


export default router;