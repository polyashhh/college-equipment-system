import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.put('/:id/block', toggleBlockUser);

export default router;