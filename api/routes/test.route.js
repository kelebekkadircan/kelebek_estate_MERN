import express from 'express';
import { shouldBeAdmin, shouldBeLoggedIn } from '../controllers/test.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/isLoggedIn', verifyToken, shouldBeLoggedIn)
router.get('/isAdmin', shouldBeAdmin)

export default router