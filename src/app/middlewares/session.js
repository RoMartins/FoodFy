const User = require('../models/userModel')


function Permission(req, res, next) {
    
    if(!req.session.userId)
        return res.redirect("/login")
    
    next()
}

async function PermissionAdm(req, res, next) {
    
    if(!req.session.userId)
        return res.redirect("/login")

        const {userId: id} = req.session
        const user = await User.FindOne({where:{id}})
        
        if(user.is_adm == false) return res.render("user/AcessoNegado", {
            error: "Apenas Administradores"
        })
    
    next()
}


function isLogged(req, res, next) {
    if(req.session.userId)
        return res.redirect('/admin/recipes')

    next()

}

module.exports = {
    Permission,
    isLogged,
    PermissionAdm
}