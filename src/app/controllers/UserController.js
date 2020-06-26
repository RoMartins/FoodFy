const User = require('../models/userModel')
const {gerarPassword} = require("../../lib/functions")
const Mailer = require("../../lib/mailer")



module.exports = {
   
    create(req,res) {
        return res.render('adm/create')
        
    },
    async post(req,res){
        const {email} = req.body

        const createPassword = gerarPassword()

        const user = await User.create(req.body, createPassword)

        //enviar senha no email
        await Mailer.sendMail({
            to: email,
            from: 'no-reply@foodfy.com.br',
            subject: 'Sua conta foi criada no foodFy!',
            html:` <h2> Seus dados para login são : </h2>
            <p> Email: ${email} </p>
            <p> Senha: ${createPassword} </p>
            <p>    
            <a href="http:localhost:3000/login" target="_blank">
             LOGIN!</a>
            </p>`
        })

            return res.render("Adm/create", {
                success:"Usuário criado com sucesso!"
            })
    },
    async list(req, res) {

        const results = await User.AllUsers()
        const users = results.rows


        return res.render('adm/users',{users} )

    },
    async edit(req,res){
        const {id} = req.params
        const results = await User.Find(id)
        const user = results.rows[0]


        return res.render('adm/edit', {user})
        
    },

    async put(req,res){
        await User.update(req.body)

        return res.redirect("/admin/users")
        
    },

    async delete(req,res){
        
        await User.delete(req.body.id)

        return res.redirect("/admin/users")

    },



}