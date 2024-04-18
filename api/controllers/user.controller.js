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
    const body = req.body

    // Check if the user is authorized to update the user
    if (tokenUserId !== id) { return res.status(403).json({ message: "You are not authorized to update this user" }) }


    try {

        const updatedUser = await prisma.user.update({
            where: { id },
            data: body
        })

        console.log("updatedUser", updatedUser);

        res.status(200).json(updatedUser)

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}
export const deleteUser = async (req, res) => {

    try {

    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

