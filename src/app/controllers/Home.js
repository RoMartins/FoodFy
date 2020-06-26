const Chefs = require("../models/chefsModel")
const Receitas = require("../models/receitas")
const File = require("../models/FileModel")


module.exports = {

    async chef(req, res) {
        let results = await Chefs.allChefs()
        const chefs = results.rows.map(chef => ({
            ...chef,
            src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
        }))
        return res.render("Área-user/chefs", { chefs })
    },

    async layout(req, res) {
        let destaques = []
        let results = await Receitas.Destaques()
        results.rows.map(rec => {
            if (rec.destaque) {
                destaques.push(rec)
            }
            return destaques
        })


        async function getImage(rec) {
            let filesResults = await Receitas.filesRec(rec.id)
            const files = filesResults.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const receitasPromise = destaques.map(async rec => {
            rec.img = await getImage(rec)

            return rec
        })

        const receitas = await Promise.all(receitasPromise)



        return res.render("Área-user/index", { receitas })

    },

    sobre(req, res) {
        return res.render("Área-user/sobre")

    },

    async rec(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 6
        let offset = limit * (page - 1)


        const results = await Receitas.paginate(filter, limit, offset)
        let receitas = results.rows

        async function getImage(rec) {
            let filesResults = await Receitas.filesRec(rec.id)
            const files = filesResults.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const receitasPromise = results.rows.map(async rec => {
            rec.img = await getImage(rec)

            return rec
        })
        receitas = await Promise.all(receitasPromise)


        const pagination = {
            total: Math.ceil(receitas[0].total / limit),
            page,
            filter
        }

        return res.render("Área-user/receitas", { receitas, filter, pagination })

    },

    async receitas(req, res) {
        let results = await Receitas.find(req.params.id)
        const receita = results.rows[0]

        if (!receita) return res.render("Área-user/receitas", {
            error: "receita não encontrada"
        })

        results = await File.FindFile(req.params.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        res.render("Área-user/preparo", { receita, files });

    },


}

