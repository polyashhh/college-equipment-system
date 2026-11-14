import express from 'express';
import { getAllRequests, createRequest, updateRequestStatus } from '../controllers/requestController.js';

const router = express.Router();

router.get('/', getAllRequests);
router.post('/', createRequest);
router.put('/:id/status', updateRequestStatus); // Обновление статуса

export default router;