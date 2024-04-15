import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('post route is working');
})
router.post('/test', (req, res) => {
    res.send('post route is working');
})
router.put('/test', (req, res) => {
    res.send('post route is working');
})
router.delete('/test', (req, res) => {
    res.send('post route is working');
})


export default router;