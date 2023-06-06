const express = require('express')
const z = require('zod')
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const { getAllUser, createUser, updateUser, getIdUser, deleteUser, findUserByEmail } = require('../database/users')
const router = express.Router()

const UserSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

router.get("/user", async (req, res) => {
    const users = await getAllUser();
    res.json({
        users
    })
})

router.get("/profile",auth, async (req, res) => {
    const user = await getIdUser(req.user.userId);
    res.json({
        user
    })
})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password
    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ message: "Login Inválido" })
    const isSamePassword = bcrypt.compareSync(password, user.password)
    if (!isSamePassword) return res.status(401).send()
    const token = jwt.sign({
        userId: user.id,
        name: user.name
    },
        process.env.SECRET
    )

    res.json({
        sucess: true,
        token
    })


})

router.post("/register", async (req, res) => {
    try {
        const user = UserSchema.parse(req.body)
        const isEmailAlreadyUsed = await findUserByEmail(user.email);
        if (isEmailAlreadyUsed)
            return res.status(400).json({
                message: "Email already is being used",
            });
        const hashPassoword = bcrypt.hashSync(req.body.password, 10)
        user.password = hashPassoword
        const create = await createUser(user)
        delete create.password
        res.status(201).json({
            user: create,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "Server error",
        });
    }
})

router.put("/user/:id", async (req, res) => {
    const id = Number(req.params.id)
    const user = UserSchema.parse(req.body)
    if(!user.id) {
        return res.status(401).json({
            message: "Não há registros"
        })
    }
    const update = await updateUser(id, user)
    res.json({
        update
    })
})

router.delete("/user/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const deleteExist = await getIdUser(id)
        if (!deleteExist) return res.status(401).json({ message: "Não há registros"})
        await deleteUser(id)
        return res.json({
            message: "Delete"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
})



module.exports = {
    router
}