import express from 'express';
import { deleteUser, savePost, getUserById, getUsers, updateUser, profilePosts } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', getUsers)
router.get('/search/:id', verifyToken, getUserById)
router.put('/:id', verifyToken, updateUser)
router.delete('/:id', verifyToken, deleteUser)
router.post("/save", verifyToken, savePost)
router.get("/profilePosts", verifyToken, profilePosts)



export default router;