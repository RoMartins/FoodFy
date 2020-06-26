const db = require ("../../config/db")
const { date } = require("../../lib/functions")
module.exports = {
    all() {
        return db.query(`SELECT receitas.*, chefs.nome_chef 
        FROM receitas
        LEFT JOIN chefs 
        ON ( receitas.chef_id = chefs.id)
        ORDER BY receitas.UPDATED_at DESC

        `)
    },

    Destaques() {
        return db.query(`SELECT receitas.*, chefs.nome_chef 
        FROM receitas
        LEFT JOIN chefs 
        ON ( receitas.chef_id = chefs.id)
        ORDER BY receitas.UPDATED_at DESC
        LIMIT 6

        `)
    },
allAdm(id) {
    return db.query(`SELECT receitas.*, chefs.nome_chef
    FROM receitas
    LEFT JOIN chefs ON ( receitas.chef_id = chefs.id)
    where receitas.user_id = $1`, [id])
},

create(data,id ){
    const query =`
    INSERT INTO receitas (
        ingredientes,
        preparo,
        informacoes,
        nome,
        chef_id,
        created_at,
        user_id,
        destaque
    ) VALUES ($1, $2, $3, $4, $5, $6,$7, $8)
    RETURNING id
`
const values = [
data.ingredientes,
data.preparo,
data.informacoes,
data.nome,
data.chef,
date(Date.now()).iso,
id,
data.destaque || false
]

return db.query(query, values)

},

find(id, callback){
    return db.query(`SELECT * 
    FROM receitas 
    WHERE id = $1`, [id])
    

},

findBy(filter){
    return db.query(`SELECT *
    FROM receitas
    WHERE receitas.nome ILIKE '%${filter}%'
    GROUP BY receitas.id `)
},

update(data) {
    const query = `
        UPDATE receitas SET
        ingredientes=($1),
        preparo=($2),
        informacoes=($3),
        nome=($4),
        chef_id=($5),
        destaque =($6)
        WHERE id = $7
    `
    const values = [
        data.ingredientes,
        data.preparo,
        data.informacoes,
        data.nome,
        data.chef,
        data.destaque || false,
        data.id
    ]

   return db.query(query, values)
},

delete(id ) {
   return db.query(`DELETE FROM receitas WHERE id = $1`, [id])
},

OptionChef(){
   return db.query(`SELECT nome_chef, id FROM chefs`)
},

paginate(filter , limit, offset) {

let totalFilter = " (SELECT count(*) FROM receitas) AS total",
    query = "" ,
    FilterQuery=""

    if(filter) {
        FilterQuery = `
            WHERE receitas.nome ILIKE '%${filter}%'
        `
        totalFilter = `(SELECT count(*) FROM receitas ${FilterQuery}) AS total`
    } 

    query = `
    SELECT receitas.*,  chefs.nome_chef , ${totalFilter}
    FROM receitas 
    LEFT JOIN chefs
    ON ( receitas.chef_id = chefs.id)
    ${FilterQuery}
    LIMIT $1 OFFSET $2`

    const values = [
        limit,
        offset
    ]
    return db.query(query,values)
},

filesRec(id){
    return db.query(`
     SELECT receitas_files.*,files.path
    FROM receitas_files
    inner join files on (files.id = receitas_files.file_id)
    where receitas_files.receita_id = $1
    `,[id])
}



}