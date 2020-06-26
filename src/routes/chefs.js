const express = require("express")
const routes = express.Router()
const multer = require('../app/middlewares/multer');

const chefs = require("../app/controllers/chefs")
const {Permission,PermissionAdm} = require('../app/middlewares/session')



//Area administrativa Chefs
routes.get("/admin/chefs",Permission, chefs.index); // Mostrar a lista 
routes.get("/admin/chefs/create",PermissionAdm, chefs.create); // Cria
routes.get("/admin/chefs/:id",Permission, chefs.show); // Exibir detalhes 
routes.get("/admin/chefs/:id/edit",PermissionAdm, chefs.edit); // Mostrar formulário de edição de receita

routes.post("/admin/chefs",multer.array("photos", 5), chefs.post); // Cadastrar 
routes.put("/admin/chefs", multer.array("photos", 5), chefs.put); // Editar 
routes.delete("/admin/chefs", chefs.delete); // Deletar 
module.exports = routes


