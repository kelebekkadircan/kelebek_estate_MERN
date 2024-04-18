import express from 'express';
import postRoute from './routes/post.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import testRouter from './routes/test.route.js';
import userRoute from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

console.log('Hello World!');

app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/test', testRouter)



app.listen(8810, () => {

    console.log('Server is running on port 8810');
})