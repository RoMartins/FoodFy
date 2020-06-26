const User = require('../models/userModel')
const crypto = require('crypto')
const Mailer = require("../../lib/mailer")
const {hash} = require("bcryptjs")


module.exports = {
    loginForm(req, res) {
        return res.render('user/login')

    },
  
    forgotForm(req, res) {
        return res.render('session/forgot-password')

    },

    login(req, res) {
        const {user} = req 
        if(user.is_adm){
        req.session.userId = req.user.id
        if(req.user.is_adm) {
            req.session.adm = true
        }

            return res.redirect('/admin/users')

        }else{
        req.session.userId = req.user.id

            return res.redirect('/admin/profile')
        }
        
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/login')
    },

   async forgot(req, res) {

        const user = req.user
        // criar token
        const token = crypto.randomBytes(20).toString("hex")
        //criar expiração
        let now = new Date
        now = now.setHours(now.getHours() + 1)
        // colocar no banco
        await  User.updateUser(user.id,{
            reset_token: token,
            reset_token_expires: now
        })
        //enviar link para recupera
        await Mailer.sendMail({
            to: user.email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Recuperação de senha',
            html:` <h2> Perdeu a chave? </h2>
            <p> Não se preocupe, clique no link abaixo para recuperar sua senha</p>
            <p>
                <a href="http:localhost:3000/password-reset?token=${token}" target="_blank">
            RECUPERAR SENHA
                </a>
            </p>
                
                `,
        })
        
        //avisar o envio do email
        return res.render("session/forgot-password", {
            success: "Verifique seu email!"
        })

    },

    resetForm(req, res) {
        return res.render('session/password-reset', {token : req.query.token})

    },

    async reset(req, res){
        const {user} = req
        const {password} = req.body

        //cria um novo hash de senha
        const newPassword = await hash(password, 8)
        //atualiza o usuário
        await User.updateUser(user.id, {
            password: newPassword,
            reset_token:"",
            reset_token_expires:"",
        })

        //avisa que ele tem uma nova senha
        return res.render("user/login", {
            user:req.body,
        success: "Senha atualizada!"
        })       
    },
    
}