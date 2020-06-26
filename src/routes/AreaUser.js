const express = require("express")
const routes = express.Router()

const home = require("../app/controllers/Home")

routes.get("/", home.layout)

routes.get("/sobre", home.sobre)
routes.get("/receitas", home.rec)
routes.get("/chefs", home.chef)
routes.get('/preparo/:id', home.receitas)




module.exports = routes