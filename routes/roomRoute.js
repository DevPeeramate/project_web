import express from 'express';
import * as roomC from '../controllers/roomController.js';

const router = express.Router();
router.post('/admin/addRoom', roomC.addRoom);
router.put('/admin/putRoom/:id', roomC.putRoom);
router.post('/admin/uploadRoomImage', roomC.uploadRoomImage);
router.get('/admin/AllRoom', roomC.getAllRoom);
router.get('/admin/PaginationRoom/:page', roomC.PaginationRoom);
router.get('/admin/searchroom/', roomC.getSearchRoom);
router.get('/admin/room/:id?', roomC.getRoomById);



export default router