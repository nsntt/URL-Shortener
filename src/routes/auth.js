import { AuthController } from "../controllers/auth.controllers";
import { AuthMiddlewares } from "../middlewares/auth.middlewares";
import { Router } from "express";

const router = Router();

router.route('/login')
    .post([AuthMiddlewares.alreadyLoggedIn, AuthMiddlewares.checkLogin], AuthController.logMe)

router.route('/register')
    .post([AuthMiddlewares.alreadyLoggedIn, AuthMiddlewares.checkRegister, AuthMiddlewares.userExist], AuthController.createMe)

router.route('/')
    .get([AuthMiddlewares.isLoggedIn], AuthController.getMe)
    .delete([AuthMiddlewares.isLoggedIn], AuthController.deleteMe)
    .put([AuthMiddlewares.isLoggedIn], AuthController.updateMyNick)


router.route('/user/:userId')    
    .get([AuthMiddlewares.userExist], AuthController.getUser)

export default router;