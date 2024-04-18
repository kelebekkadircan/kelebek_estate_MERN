import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';



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

        res.status(201).json({ newUser, message: 'User created successfully' })

    }

    catch (err) {
        res.status(500).json({ message: err.message })
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
        //ms cinsinden bir hafta oluşturup maxAge ile cookie nin ömrünü belirledik
        const aged = 1000 * 60 * 60 * 24 * 7;

        //create a token
        // jwt.sign ile token oluşturuyoruz 
        // ilk parametre payload ikinci parametre ise secret key üçüncü parametre ise tokenin ömrü
        const token = jwt.sign({
            id: user.id,
            isAdmin: true
        }, process.env.JWT_SECRET_KEY, { expiresIn: aged })

        const { password: userPassword, ...rest } = user

        // cookie parser sayesinde res.cookie ile cookie oluşturabiliriz 
        // ilk parametre cookie nin adı ikinci parametre ise değeri
        // üçüncü parametre ise cookie nin özellikleri
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: aged
        }).status(200).json({ rest })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Fail to login' })
    }

    //check if the password is correct

    //create a token and send it to the user

}
export const logout = (req, res) => {


    res.clearCookie('token').status(200).json({ message: 'Logged out SUCCESSFULL' })

}