import express from 'express';
import * as roomC from '../controllers/roomController.js';

const router = express.Router();
router.post('/admin/addRoom', roomC.addRoom);

export default router