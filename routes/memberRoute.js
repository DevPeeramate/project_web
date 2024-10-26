import express from 'express';
import * as memberC from '../controllers/memberController.js';

const router = express.Router();
router.get('/session', memberC.getSession);
router.post('/register', memberC.register);
router.post('/uploadProfileImage/:id', memberC.uploadProfileImage);
router.post('/login', memberC.login);
router.get('/logout', memberC.logout);
router.delete('/delete/:username', memberC.deleteAccount);

export default router