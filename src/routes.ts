import express from 'express';
import AuthController from './controller/authController';
import authMiddlware from './middleware/authorization';

const authController =  new AuthController();

const routes = express.Router();


routes.post('/auth/register', authController.create);
routes.post('/auth/login', authController.login);
routes.delete('/auth/logout', authController.logout);
routes.post('/auth/show', authMiddlware, authController.show);


export default routes;