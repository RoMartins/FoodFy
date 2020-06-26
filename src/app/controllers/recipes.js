const User = require('../models/userModel')
const Receitas = require("../models/receitas")
const File = require("../models/FileModel")
const user = require('../validators/user')

module.exports = {

    // Area administrativa
    async index(req, res) {

        const {userId: id} = req.session

        let results = await Receitas.allAdm(id)

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

    },
   

    async create(req, res) {
        let results = await Receitas.OptionChef()
        const options = results.rows

        const {userId : id} = req.session
        results = await User.Find(id)
        const user = results.rows[0]

        if(user.is_adm){
            return res.render("Área-Adm/create", { options, user })
        }

        return res.render("Área-Adm/create", { options })


    },
    async post(req, res) {
        let chefs = await Receitas.OptionChef()
        const options = chefs.rows

        const Keys = Object.keys(req.body)
        for (key of Keys) {
            if (req.body[key] == "") return res.render("Área-Adm/create",{
                options,
                receita:req.body,
                error:"Por favor, preencha todos os campos!"})
        }
        

        if(req.files.length == 0) {
            return res.render("Área-Adm/create",{
                options,
                receita:req.body,
                error:'Envie pelo menos 1 imagem'})
        }

        const filesPromise = req.files.map(file => File.create({
            ...file,
            
        }))
        const resultsFile = await (await Promise.all(filesPromise)).map(file=> file.rows[0].id)
        
        const {userId: id} = req.session

        const results = await Receitas.create(req.body,id)
        const receitaId = results.rows[0].id    

        resultsFile.map(id => File.receitas_files(id, receitaId))

        return res.redirect(`/admin/recipes/${receitaId}`)

    },

    async show(req, res) {
        let results = await Receitas.find(req.params.id)
        const receita = results.rows[0]

            if (!receita) return res.send("receita não encontrada")
        
        results = await File.FindFile(req.params.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("Área-Adm/show", { receita , files })
        
    },
    async edit(req, res) {

        let results = await Receitas.find(req.params.id) 
        const receita = results.rows[0]

            if (!receita) return res.send("receita não encontrada")

        results = await File.FindFile(req.params.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))    

        results = await Receitas.OptionChef()
        const options = results.rows

        const {userId : id} = req.session
        results = await User.Find(id)
        const user = results.rows[0]

        if(user.is_adm){
            return res.render("Área-Adm/edit", { options, user, receita, files })
        }
            
        return res.render("Área-Adm/edit", { options, receita , files})
        

        

    },
    async put(req, res) {
        const Keys = Object.keys(req.body)
        for(key of Keys){
            if(req.body[key] == "" & key != "removed_files"){
                return res.send("Preencha todos o campos")
            }
        }
        
        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1 
            removedFiles.splice(lastIndex,1)

            const removedFilePromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilePromise)
        }
         
       

        if(req.files.length != 0) {
            const filesPromise = req.files.map(file => File.create({
                ...file,
            }))
            const resultsFile = await (await Promise.all(filesPromise)).map(file=> file.rows[0].id)
            receitaId = req.body.id
            resultsFile.map(id => File.receitas_files(id, receitaId))

        }
      
        await Receitas.update(req.body) 



        return res.redirect(`/admin/recipes/${req.body.id}`)

    },
    async delete(req, res) {
        await Receitas.delete(req.body.id)
            return res.render(`Área-Adm/layout1`, {
                success:"Receita deletada"
            })
        
    }

}



