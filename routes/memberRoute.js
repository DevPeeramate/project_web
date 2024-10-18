import express from 'express';
import * as memberC from '../controllers/memberController.js';

const router = express.Router();
router.post('/register', memberC.register);
router.post('/login', memberC.login);
router.get('/logout', memberC.logout);

export default router