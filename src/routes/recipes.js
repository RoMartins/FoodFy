const express = require("express")
const routes = express.Router()
const multer = require('../app/middlewares/multer');

const recipes = require("../app/controllers/recipes")
const AdminValidator = require("../app/validators/admin")
const { Permission} = require('../app/middlewares/session')


routes.get("/admin/recipes",Permission, AdminValidator.recipes, recipes.index); // Mostrar a lista de receitas
routes.get("/admin/create",Permission, recipes.create); // Mostrar a lista de receitas
routes.get("/admin/recipes/:id",Permission, recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit",Permission, recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes",multer.array("photos", 5) ,recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita






module.exports = routes