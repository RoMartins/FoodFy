const User = require('../models/userModel')


module.exports = {
   async index(req, res) {
        const {userId: id} = req.session
        const user = await User.FindOne({where:{id}})

        
        return res.render('session/user', {user})

    },
async put (req, res) {

    const {user} = req
    const { name, email, adm} = req.body

    await User.update(user.id, {
                name, 
                email,
                adm
            })

            return res.render("session/user", {
                user:req.body,
                success: "Conta atualizada com sucesso"
            })
},

}