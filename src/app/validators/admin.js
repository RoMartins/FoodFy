const User = require('../models/userModel')
const Receitas = require("../models/receitas")
const File = require("../models/FileModel")



module.exports = {
   async recipes(req,res, next){

        const {userId: id} = req.session
        const user = await User.FindOne({where:{id}})

        if(user.is_adm == true){

            let results = await Receitas.all()

            async function getImage(rec) {
                let filesResults = await Receitas.filesRec(rec.id)
                const files = filesResults.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                
                 return files[0]
            }
    
            const receitasPromise = results.rows.map(async rec => {
                rec.img = await getImage(rec)
                
                return rec
            })
    
            const receitas = await Promise.all(receitasPromise)
    
            return res.render("Área-Adm/recipes", { receitas })


        } 

        next()

    },   
}   