import { Router } from "express";
import { AuthMiddlewares } from "../middlewares/auth.middlewares";
import UrlRoutes from './urls';
import AuthRoutes from './auth';

const router = Router();

router.use('/url', [AuthMiddlewares.isBanned], UrlRoutes);
router.use('/auth', [AuthMiddlewares.isBanned], AuthRoutes);
router.use('*', (req, res) => {
    res.json({ status: 200, message: 'hello!!' });
});


export default router;