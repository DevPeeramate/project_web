import express from 'express';
import * as roomC from '../controllers/roomController.js';

const router = express.Router();
router.post('/admin/addRoom', roomC.addRoom);
router.get('/admin/searchroom/', roomC.getSearchRoom);

export default router