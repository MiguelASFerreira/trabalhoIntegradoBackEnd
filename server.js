const express = require('express')
const logger = require("./src/middleware/logger")
const userRoutes = require('./src/routes/users')
const recipeRoute = require("./src/routes/recipes")
const server = express()

server.use(express.json())
server.use(logger)
server.use(userRoutes.router)
server.use(recipeRoute.router)



const port = 3000
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})