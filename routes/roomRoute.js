import express from 'express';
import * as roomC from '../controllers/roomController.js';

const router = express.Router();
router.post('/admin/manageRoom', roomC.addRoom);
router.put('/admin/manageRoom/:id', roomC.putRoom);
// edit manageRoom path
router.post('/admin/uploadRoomImage/:id/:roomName', roomC.uploadRoomImage);
router.get('/allRoom', roomC.searchAllRoom);
// router.get('/admin/PaginationRoom/:page', roomC.PaginationRoom);
router.get('/admin/searchRoom/:id?', roomC.searchRoom);
router.get('/admin/room/:id', roomC.getRoomById);

router.post('/rooms', roomC.searchRoomByType);



export default router