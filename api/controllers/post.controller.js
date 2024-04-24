import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const getPosts = async (req, res) => {

    const query = req.query;

    try {

        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                bedrooms: parseInt(query.bedrooms) || undefined,
                bathrooms: parseInt(query.bathrooms) || undefined,
                price:
                {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 100000,
                }

            }
        });


        // setTimeout(() => {
        res.status(200).json({ message: 'Get Posts', posts });
        // }, 500)


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get Posts' });
    }
}
export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        const token = req.cookies?.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    const saved = await prisma.savedPost.findUnique({
                        where: {
                            userId_postId: {
                                postId: id,
                                userId: payload.id,
                            },
                        },
                    });
                    res.status(200).json({ ...post, isSaved: saved ? true : false });
                }
            });
        }
        // res.status(200).json({ ...post, isSaved: false });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get post" });
    }
};

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;


    try {

        const newPost = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail
                }
            }
        })

        res.status(200).json({ message: 'Get Posts', newPost });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add Posts' });
    }
}
export const updatePost = async (req, res) => {

    try {

        res.status(200).json({ message: 'Get Posts' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to update Posts' });
    }
}
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;



    try {
        const post = await prisma.post.findUnique({
            where: { id }

        })

        if (post.userId !== tokenUserId) {
            return res.status(403).json({ message: 'Unauthorized for deleting this post' });
        }

        await prisma.post.delete({
            where: { id }

        })

        res.status(200).json({ message: 'Post Deleted' });

        res.status(200).json({ message: 'Get Posts' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete Posts' });
    }
}