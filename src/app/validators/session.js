const User = require('../models/userModel')
const {compare} = require('bcryptjs')




module.exports ={
   async login(req,res,next){
        const {email, password} = req.body

        const user = await  User.FindOne({where:{email}})

        if(!user) res.render('user/login', {
            user:req.body,
            error:"Usuário não encontrado!"
        })

        const senha = await compare(password, user.password)

        if(!senha) return res.render('user/login', {
            user:req.body,
            error:"Senha incorreta"
        })
        
        req.user = user

        next()
    },
   async forgot(req,res, next) {
        const {email} = req.body

        try{
            let user = await User.FindOne({where :{email}})
            if(!user) res.render('session/forgot-password', {
                user:req.body,
                error:"Email não encontrado!"
            })

            req.user = user
            next()

        }catch(err){
            console.log(err)
        }

    },

    async reset(req,res, next) {
        const { email, password, passwordRepeat, token} = req.body
        //procura o usuáriio 
        const user = await User.FindOne({where:{email}})
        
        if(!user) return res.render("session/password-reset", {
            user: req.body,
            token,
            error:"Usuário não encontrado"
        })

        // confere senha
        if(password != passwordRepeat) return res.render("session/password-reset", {
            user: req.body,
            token,
            error:"Senhas não conferem"
        })
        //confere token
        if(token != user.reset_token) return res.render("session/password-reset", {
            user: req.body,
            token,
            error:"Token inválido, solicite uma nova recuperação senha!"
        })
        //verifica se token expirou
        let now = new Date()
        now = now.setHours(now.getHours())
        if(now > user.reset_token_expires) return res.render("session/password-reset", {
            user: req.body,
            token,
            error:" Token expirado, solicite uma nova recuperação senha!"
        })
      
        req.user = user
        next()
    },

}