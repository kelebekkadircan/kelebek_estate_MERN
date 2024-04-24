import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {

    console.log("getUsers called");

    try {

        const users = await prisma.user.findMany()
        if (!users) {
            res.status(404).json({ message: "No users found" })
        }
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
export const getUserById = async (req, res) => {

    const id = req.params.id

    try {

        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user) {
            res.status(404).json({ message: "No user found" })
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ message: "Failed to get userbyId" })

    }
}
export const updateUser = async (req, res) => {

    const id = req.params.id
    const tokenUserId = req.userId;
    const { password, avatar, ...rest } = req.body

    // Check if the user is authorized to update the user
    if (tokenUserId !== id) { return res.status(403).json({ message: "You are not authorized to update this user" }) }

    let updatedPassword = null;

    try {

        if (password) {
            updatedPassword = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...rest,
                ...(updatedPassword && { password: updatedPassword }),
                ...(avatar && { avatar })
            }
        })

        console.log("updatedUser", updatedUser);
        const { password: hashedPassword, ...user } = updatedUser;

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
export const deleteUser = async (req, res) => {

    const id = req.params.id
    const tokenUserId = req.userId;

    if (id !== tokenUserId) {
        return res.status(403).json({ message: "You are not authorized to delete this user" })
    }

    try {
        await prisma.user.delete({ where: { id } })
        res.status(200).json({ message: "User deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

export const savePost = async (req, res) => {
    const postId = req.body.postId;
    const tokenUserId = req.userId;

    try {
        const savedPost = await prisma.savedPost.findUnique({
            where: {
                userId_postId: {
                    userId: tokenUserId,
                    postId,
                },
            },
        });

        if (savedPost) {
            await prisma.savedPost.delete({
                where: {
                    id: savedPost.id,
                },
            });
            res.status(200).json({ message: "Post removed from saved list" });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId: tokenUserId,
                    postId,
                },
            });
            res.status(200).json({ message: "Post saved" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete users!" });
    }

};

export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId;

    try {
        const userPosts = await prisma.post.findMany({ where: { userId: tokenUserId } })

        // if (!userPosts) {
        //     res.status(404).json({ message: "No posts found" })
        // }

        const saved = await prisma.savedPost.findMany({
            where: { userId: tokenUserId },
            include: {
                post: true
            }
        })

        const savedPosts = saved.map((post) => post.post)   // get only the post data from the savedPost object 



        res.status(200).json({ userPosts, savedPosts })
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get profile posts" })

    }

}