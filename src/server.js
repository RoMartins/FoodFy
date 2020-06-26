const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOver = require('method-override')
const session = require('./config/session')
const server = express()

server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
server.use(express.urlencoded({ extended: true}))
server.set("view engine", "njk")
server.use(express.static('public'))
server.use(express.static('images'))
server.use(methodOver('_method'))
server.use(routes)

nunjucks.configure("src/app/views", {
    express: server
})


server.listen(5005, () => {
    console.log("Meu primeiro server")

})
