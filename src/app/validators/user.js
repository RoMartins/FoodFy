const User = require('../models/userModel')
const {compare} = require("bcryptjs")

function checkAllFields(body){
    const keys = Object.keys(body)
    for(key of keys){
        if(body[key] == "")

         return {
            user: body,
            error : 'Preencha todos os campos'
         }
    }
}

async function post(req,res,next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("Adm/create", fillAllFields)
    }

    let { email} = req.body
     
    const user = await User.FindOne({
         where:{email}, 
     })

     if(user) return res.render('Adm/create', {
        user : req.body,
        error:'Usuário já cadastrado'
    })

    next()

}

async function update(req, res, next){
    const fillAllFields = checkAllFields(req.body)
    
    if(fillAllFields){
        return res.render("session/user", fillAllFields)
    }
    const {password} = req.body
    const {userId : id} = req.session

    if(!password) return res.render('session/user', {
        user:req.body,
        error:"Coloque sua senha para atualizar o cadastro"
    })

    const user = await User.FindOne({where : {id}})

    const passed = await compare(password, user.password)

    if(!passed) return res.render('session/user', {
        user:req.body,
        error:"Senha incorreta"
    })

    req.user = user

    next()
}

module.exports = {
    post,
    update
}