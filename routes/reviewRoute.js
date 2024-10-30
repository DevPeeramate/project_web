import express from 'express';
import * as reviewC from '../controllers/reviewController.js';

const router = express.Router();

router.post('/review', reviewC.postReview);
router.get('/review', reviewC.getAllReview);
router.get('/myReview/:username', reviewC.getMyReview);
router.put('/myReview/:username', reviewC.updateReview);
router.delete('/myReview/:username/:reviewId', reviewC.deleteReview);

export default router