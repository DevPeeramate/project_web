import express from 'express';
import * as reservationC from '../controllers/reservationController.js';

const router = express.Router();

router.post('/reservation', reservationC.addReservation);
router.get('/reservation/:username', reservationC.getReservation);

export default router