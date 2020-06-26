const Chefs = require ("../models/chefsModel")
const File = require("../models/FileModel")


module.exports = {
    
    async index(req, res) {
        let results = await Chefs.all()
        const chefs = results.rows.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
    }))
               
            return res.render("chefs/index", {chefs} )

    },
    create(req, res) {
        return res.render("chefs/create")

    },
    async post(req, res) {
        const Keys = Object.keys(req.body)
        for (key of Keys) {
            if (req.body[key] == "") return res.render("chefs/create",{
                error:"Por favor, preencha todos os campos!"})
        }

        if(req.files.length == 0 ){
            return res.render("chefs/create",{
                error:"Envie pelo menos uma foto !"})
        }

        const filePromise = req.files.map(file => File.create({
            ...file,
        }))
       
        let results= await Promise.all(filePromise)  
        

        const FileId =  results.map(row => row.rows[0].id)
        
            results = await Chefs.create(req.body,...FileId ) 
            const chefsId = results.rows[0].id

       return res.redirect(`/admin/chefs/${chefsId}`)

    },
    async show(req, res) {
        let results = await Chefs.find(req.params.id) 
        const chef = results.rows[0]

           if(!chef) return res.send("Chef não encontrado")

           
           let result = await Chefs.findRec(req.params.id) 
           const recipes = result.rows
           
           const receitas = recipes.map( recipe=> ({
               ...recipe,
            src: `${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`,
            receitaId : recipe.receita_id
           })).reduce((ReceitasFilter, recipe)=> {

                const found = ReceitasFilter.some(rec => rec.receitaId == recipe.receitaId)
                
                if(!found) ReceitasFilter.push(recipe)
            return ReceitasFilter
           },[])



        result = await Chefs.FindFile(req.params.id)
        const avatar = result.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))


        return res.render("chefs/show", {chef, receitas, avatar})
           
    },
    async edit(req, res) {
        let results = await Chefs.find(req.params.id) 
        const chef = results.rows[0]
            if(!chef) return res.send("Chef não encontrado")
            
            results = await Chefs.FindFile(req.params.id)
            const avatar = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            
        }))    


       
        return res.render("chefs/edit", {chef, avatar})
        
    },
    async put(req, res){
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


            const resultsFile = await Promise.all(filesPromise)
            const FileId =  resultsFile.map(row => row.rows[0].id)


            FileId.map(id => Chefs.updateFileId(req.body , id))

        }
       
       const results = await Chefs.update(req.body)
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
        
    },
    async delete(req, res) {
      const deletar = await Chefs.delete(req.body.id)
            return res.redirect(`/admin/chefs`)
    }

}

    

