const express = require("express")
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/Session')
const {isLogged} = require('../app/middlewares/session')

//LOGIN
routes.get('/login',isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout' , SessionController.logout) 



routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password' ,SessionValidator.forgot, SessionController.forgot) 
routes.get('/password-reset', SessionController.resetForm)
routes.post('/password-reset' ,SessionValidator.reset, SessionController.reset) 






module.exports = routes
