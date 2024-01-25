import { UrlController } from "../controllers/url.controllers";
import { AuthMiddlewares } from "../middlewares/auth.middlewares";
import { UrlMiddlewares } from "../middlewares/url.middlewares";
import { Router } from "express";

const router = Router();

router.route('/')
    .post([AuthMiddlewares.isLoggedIn, UrlMiddlewares.isValidUrl, UrlMiddlewares.limitedUrl], UrlController.createUrl)

router.route('/:personalizedLink')
    .get([UrlMiddlewares.urlExist, UrlMiddlewares.isDeleted], UrlController.getUrl)
    .delete([AuthMiddlewares.isLoggedIn, UrlMiddlewares.urlExist, UrlMiddlewares.isMyUrl, UrlMiddlewares.isDeleted], UrlController.deleteUrl)
    .put([AuthMiddlewares.isLoggedIn, UrlMiddlewares.urlExist, UrlMiddlewares.isMyUrl, UrlMiddlewares.isValidUrl, UrlMiddlewares.isDeleted], UrlController.editUrl)


export default router;