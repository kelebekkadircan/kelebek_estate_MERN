import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';


export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        console.log(hashedPassword);


        //create a new user save to db
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
        })
        console.log(newUser);

        res.status(201).json({ message: 'User created successfully' })

    }

    catch (err) {
        res.status(500).json({ message: 'Fail to create user' })
    }

}
export const login = async (req, res) => {

    const { username, password } = req.body

    //check if the user exists
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        //compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(500).json({ message: 'Invalid credentials' })
        }

        //create a token
        res.setHeader("Set-Cookie", "test=" + "myValue")

        res.status(200).json({ message: 'Login successful' })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Fail to login' })
    }

    //check if the password is correct

    //create a token and send it to the user

}
export const logout = (req, res) => {

}