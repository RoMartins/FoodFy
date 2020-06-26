const express = require("express")
const routes = express.Router()


const chefs = require("./routes/chefs")
const AreaUser = require("./routes/areauser")
const recipes = require("./routes/recipes")
const login = require("./routes/login")
const profile = require("./routes/profile")
const Adm = require("./routes/Administrador")

//Area-usuario
routes.use(AreaUser)

//Area administrativa Receitas
routes.use(recipes)

//Area administrativa Chefs
routes.use(chefs)

//Session
routes.use(login)

//Profile
routes.use(profile)

//Administrador
routes.use(Adm)

module.exports = routes
