import express from 'express';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { dashboardController } from '~/controllers/dashboardController';

const Router = express.Router();

Router.route('/access').get(
  authMiddleware.isAuthorized,
  dashboardController.access
);

export const dashboardRoute = Router;
