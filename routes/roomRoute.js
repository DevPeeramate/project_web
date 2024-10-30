import express from 'express';
import * as roomC from '../controllers/roomController.js';

const router = express.Router();
router.post('/admin/addRoom', roomC.addRoom);
router.put('/admin/putRoom/:id', roomC.putRoom);
router.post('/admin/uploadRoomImage/:id', roomC.uploadRoomImage);
router.get('/admin/AllRoom', roomC.searchAllRoom);
router.get('/admin/PaginationRoom/:page', roomC.PaginationRoom);
router.get('/admin/searchRoom/:id?', roomC.searchRoom);
router.get('/admin/room/:id', roomC.getRoomById);

router.post('/rooms', roomC.searchRoomByType);



export default router