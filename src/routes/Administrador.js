const express = require("express")
const routes = express.Router()

const UserValidator = require('../app/validators/user')
const UserController = require('../app/controllers/UserController')
const {PermissionAdm} = require('../app/middlewares/session')

routes.get('/admin/users',PermissionAdm, UserController.list) //Mostrar a lista de usuários cadastrados
routes.get("/admin/users/create",PermissionAdm, UserController.create); // Mostrar formulário de edição de receita
routes.get("/admin/users/:id/edit",PermissionAdm, UserController.edit); // Mostrar formulário de edição de receita

routes.post('/admin/users',UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/admin/users', UserController.put)
routes.delete('/admin/users', UserController.delete)








module.exports = routes
