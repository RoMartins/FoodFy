const express = require("express")
const routes = express.Router()

const UserValidator = require('../app/validators/user')
const ProfileController = require('../app/controllers/ProfileController')
const { Permission} = require('../app/middlewares/session')

routes.get('/admin/profile',Permission, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile',UserValidator.update, ProfileController.put)// Editar o usuário logado









module.exports = routes
